import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicioExtraService } from './servicio-extra.service';
import { ServicioExtra, CompraServicio } from './servicio-extra.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-servicio-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './servicio-list.html',
  styleUrl: './servicio-list.css'
})
export class ServicioList implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly servicioService = inject(ServicioExtraService);
  protected readonly authService = inject(AuthService);

  // Pestaña Activa: 'catalogo' | 'solicitudes'
  protected readonly tabActiva = signal<'catalogo' | 'solicitudes'>('catalogo');
  protected readonly categoriaFiltro = signal<string>('TODAS');

  // Datos reactivos
  protected readonly servicios = signal<ServicioExtra[]>([]);
  protected readonly compras = signal<CompraServicio[]>([]);
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  // Modal Compra/Solicitud (Residente)
  protected readonly mostrarModalCompra = signal<boolean>(false);
  protected readonly servicioSeleccionado = signal<ServicioExtra | null>(null);

  // Modal CRUD Servicio (Admin)
  protected readonly mostrarModalAdmin = signal<boolean>(false);
  protected readonly editandoServicioId = signal<number | null>(null);

  // Presets para Admin
  protected readonly iconosDisponibles = ['🧺', '🧹', '🚗', '🧊', '♨️', '🌐', '💧', '🖨️', '📦', '🧼', '⚡', '🚴'];
  protected readonly categoriasDisponibles = ['Limpieza', 'Equipamiento', 'Estacionamiento', 'Tecnología', 'Alimentación', 'Académico', 'Almacén', 'Bienestar'];
  protected readonly unidadesDisponibles = ['Carga', 'Mes', 'Sesión', 'Bidón', 'Pack', 'Unidad', 'Día'];

  // Formulario Solicitud / Compra
  protected readonly formCompra: FormGroup = this.fb.group({
    cantidad: [1, [Validators.required, Validators.min(1)]],
    habitacionNumero: ['101', [Validators.required]],
    huespedNombre: ['', [Validators.required]],
    notas: ['']
  });

  // Formulario Admin CRUD Servicio
  protected readonly formAdmin: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(255)]],
    categoria: ['Limpieza', [Validators.required]],
    icono: ['🧺', [Validators.required]],
    unidad: ['Carga', [Validators.required]],
    precio: [15.00, [Validators.required, Validators.min(0.01)]],
    activo: [true]
  });

  // Cálculo reactivo del total de la compra
  protected readonly totalCompra = computed(() => {
    const s = this.servicioSeleccionado();
    if (!s) return 0;
    const cant = this.formCompra.get('cantidad')?.value || 1;
    return s.precio * cant;
  });

  // Filtrado reactivo del catálogo
  protected readonly serviciosFiltrados = computed(() => {
    const cat = this.categoriaFiltro();
    const list = this.servicios();
    if (cat === 'TODAS') return list;
    return list.filter((s) => s.categoria?.toLowerCase() === cat.toLowerCase());
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando.set(true);
    this.error.set(null);

    // Cargar Catálogo (Admin ve todos, residente ve activos)
    const reqServicios$ = (this.authService.isAdmin() || this.authService.isSupervisor())
      ? this.servicioService.listarTodos()
      : this.servicioService.listarActivos();

    reqServicios$.subscribe({
      next: (data) => {
        this.servicios.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando catálogo de servicios', err);
        this.error.set('No se pudo cargar el catálogo de servicios.');
        this.cargando.set(false);
      }
    });

    // Cargar Solicitudes (ABAC backend)
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.servicioService.listarCompras().subscribe({
      next: (data) => this.compras.set(data),
      error: (err) => console.error('Error cargando solicitudes', err)
    });
  }

  setTab(tab: 'catalogo' | 'solicitudes'): void {
    this.tabActiva.set(tab);
    if (tab === 'solicitudes') {
      this.cargarSolicitudes();
    }
  }

  filtrarPorCategoria(cat: string): void {
    this.categoriaFiltro.set(cat);
  }

  // --- Modal Compra Residente ---
  abrirModalCompra(servicio: ServicioExtra): void {
    this.servicioSeleccionado.set(servicio);
    const currentUser = this.authService.currentUser();
    const nombre = currentUser?.nombre || this.authService.currentUsername();
    
    // Asignar habitación tentativa del residente si se detecta
    let habitacion = '101';
    if (this.authService.currentUsername() === 'residente2') {
      habitacion = '201';
    }

    this.formCompra.reset({
      cantidad: 1,
      habitacionNumero: habitacion,
      huespedNombre: nombre,
      notas: ''
    });
    this.mostrarModalCompra.set(true);
  }

  cerrarModalCompra(): void {
    this.mostrarModalCompra.set(false);
    this.servicioSeleccionado.set(null);
  }

  confirmarSolicitud(): void {
    if (this.formCompra.invalid) {
      this.formCompra.markAllAsTouched();
      return;
    }

    const s = this.servicioSeleccionado();
    if (!s || !s.id) return;

    const val = this.formCompra.value;
    const dto: CompraServicio = {
      servicioId: s.id,
      servicioNombre: s.nombre,
      huespedNombre: val.huespedNombre,
      habitacionNumero: val.habitacionNumero,
      cantidad: Number(val.cantidad),
      precioUnitario: s.precio,
      notas: val.notas
    };

    this.servicioService.solicitarServicio(dto).subscribe({
      next: () => {
        this.exito.set(`¡Solicitud de "${s.nombre}" enviada con éxito! La administración atenderá su pedido.`);
        this.cerrarModalCompra();
        this.cargarSolicitudes();
        this.setTab('solicitudes');
        setTimeout(() => this.exito.set(null), 5000);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudo procesar la solicitud del servicio.');
      }
    });
  }

  // --- Modal Admin CRUD ---
  abrirModalAdminCrear(): void {
    this.editandoServicioId.set(null);
    this.formAdmin.reset({
      nombre: '',
      descripcion: '',
      categoria: 'Limpieza',
      icono: '🧺',
      unidad: 'Carga',
      precio: 15.00,
      activo: true
    });
    this.mostrarModalAdmin.set(true);
  }

  abrirModalAdminEditar(servicio: ServicioExtra): void {
    this.editandoServicioId.set(servicio.id ?? null);
    this.formAdmin.patchValue({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion || '',
      categoria: servicio.categoria || 'Limpieza',
      icono: servicio.icono || '🧺',
      unidad: servicio.unidad || 'Carga',
      precio: servicio.precio,
      activo: servicio.activo ?? true
    });
    this.mostrarModalAdmin.set(true);
  }

  cerrarModalAdmin(): void {
    this.mostrarModalAdmin.set(false);
    this.editandoServicioId.set(null);
  }

  seleccionarIconoAdmin(ico: string): void {
    this.formAdmin.patchValue({ icono: ico });
  }

  guardarServicioAdmin(): void {
    if (this.formAdmin.invalid) {
      this.formAdmin.markAllAsTouched();
      return;
    }

    const val = this.formAdmin.value;
    const dto: ServicioExtra = {
      nombre: val.nombre,
      descripcion: val.descripcion,
      categoria: val.categoria,
      icono: val.icono,
      unidad: val.unidad,
      precio: Number(val.precio),
      activo: val.activo
    };

    const id = this.editandoServicioId();
    if (id) {
      this.servicioService.actualizar(id, dto).subscribe({
        next: () => {
          this.exito.set('Servicio actualizado en el catálogo.');
          this.cerrarModalAdmin();
          this.cargarDatos();
          setTimeout(() => this.exito.set(null), 4000);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error actualizando servicio.');
        }
      });
    } else {
      this.servicioService.crear(dto).subscribe({
        next: () => {
          this.exito.set('Nuevo servicio añadido al catálogo de Oasis.');
          this.cerrarModalAdmin();
          this.cargarDatos();
          setTimeout(() => this.exito.set(null), 4000);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error creando nuevo servicio.');
        }
      });
    }
  }

  eliminarServicio(servicio: ServicioExtra): void {
    if (!servicio.id) return;
    if (confirm(`¿Está seguro de eliminar el servicio "${servicio.nombre}" del catálogo?`)) {
      this.servicioService.eliminar(servicio.id).subscribe({
        next: () => {
          this.exito.set(`Servicio "${servicio.nombre}" eliminado.`);
          this.cargarDatos();
          setTimeout(() => this.exito.set(null), 4000);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudo eliminar el servicio.');
        }
      });
    }
  }

  // --- Cambio de estado por Admin ---
  cambiarEstadoSolicitud(compraId: number | undefined, nuevoEstado: string): void {
    if (!compraId) return;
    this.servicioService.actualizarEstado(compraId, nuevoEstado).subscribe({
      next: () => {
        this.exito.set(`Estado de la solicitud actualizado a: ${nuevoEstado}`);
        this.cargarSolicitudes();
        setTimeout(() => this.exito.set(null), 3000);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudo actualizar el estado de la solicitud.');
      }
    });
  }
}
