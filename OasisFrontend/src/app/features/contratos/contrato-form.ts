import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContratoService } from './contrato-service';
import { ContratoRequest } from './contrato.model';
import { HabitacionService } from '../alojamiento/habitacion/habitacion-service';
import { Habitacion } from '../alojamiento/habitacion/habitacion.model';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../core/services/api-service';
import { ConceptoContratoService } from './conceptos/concepto-contrato.service';
import { ConceptoContrato } from './conceptos/concepto-contrato.model';
import { SEED_HUESPEDES } from '../residentes/huesped-seed';
import { SEED_HABITACIONES } from '../alojamiento/habitacion/habitacion-seed';
import { SEED_CONCEPTOS_CONTRATO } from './conceptos/concepto-contrato-seed';

interface HuespedDTO {
  id?: number;
  nombreCompleto: string;
  numeroDocumento: string;
  email: string;
  perfil: string;
}

interface TipoContratoDTO {
  id: number;
  nombre: string;
  duracionMeses: number;
  penalidadIncumplimiento?: boolean;
}

@Component({
  selector: 'app-contrato-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './contrato-form.html',
  styleUrl: './contrato-form.css',
})
export class ContratoForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contratoService = inject(ContratoService);
  private readonly habitacionService = inject(HabitacionService);
  private readonly conceptoService = inject(ConceptoContratoService);
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  // Catálogos cargados en vivo (inicializados con datos semilla para disponibilidad inmediata y continua)
  protected readonly huespedes = signal<HuespedDTO[]>(SEED_HUESPEDES);
  protected readonly habitacionesDisponibles = signal<Habitacion[]>(
    SEED_HABITACIONES.filter((h) => h.estado === 'DISPONIBLE')
  );
  protected readonly conceptosRapidos = signal<ConceptoContrato[]>(SEED_CONCEPTOS_CONTRATO);
  protected readonly tiposContrato = signal<TipoContratoDTO[]>([
    { id: 1, nombre: 'Contrato Semestral (6 meses)', duracionMeses: 6 },
    { id: 2, nombre: 'Contrato Anual (12 meses)', duracionMeses: 12 },
    { id: 3, nombre: 'Contrato Multianual (24 meses)', duracionMeses: 24 }
  ]);
  
  // Estados de interfaz y feedback
  protected readonly cargando = signal<boolean>(false);
  protected readonly guardando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly mostrarModalConfirmacion = signal<boolean>(false);

  // Formulario Reactivo Cabecera-Detalle
  protected readonly form = this.fb.group({
    huespedId: [0, [Validators.required, Validators.min(1)]],
    habitacionId: [0, [Validators.required, Validators.min(1)]],
    tipoContratoId: [2, [Validators.required, Validators.min(1)]],
    fechaInicio: ['2026-10-01', [Validators.required]],
    fechaFin: ['2027-09-30', [Validators.required]],
    detalles: this.fb.array<FormGroup>([]),
  });

  // Signal derivado de valueChanges para cálculos reactivos con computed
  private readonly formValues = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  // Cálculo en vivo del Total General con computed (Signals)
  protected readonly totalGeneral = computed(() => {
    const vals = this.formValues();
    const lineas = vals?.detalles || [];
    return lineas.reduce((acc: number, item: any) => {
      const cant = Number(item?.cantidad || 0);
      const precio = Number(item?.precioUnitario || 0);
      return acc + (cant * precio);
    }, 0);
  });

  // Cantidad total de conceptos
  protected readonly totalItems = computed(() => {
    const vals = this.formValues();
    return vals?.detalles?.length || 0;
  });

  get detallesArray(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  ngOnInit(): void {
    this.cargarCatalogos();
    // Iniciar con al menos una línea obligatoria (Alquiler Mensual)
    this.agregarLinea('Alquiler Mensual Base', 1, 480.00);
    this.recalcularFechaFin(12);
  }

  private cargarCatalogos(): void {
    this.cargando.set(true);
    // Cargar Huéspedes con respaldo automático
    this.http.get<HuespedDTO[]>(this.api.buildUrl('/api/v1/residentes')).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.huespedes.set(data);
        } else {
          this.huespedes.set(SEED_HUESPEDES);
        }
      },
      error: () => {
        console.warn('Usando catálogo local de residentes para contratos.');
        this.huespedes.set(SEED_HUESPEDES);
      },
    });

    // Cargar Habitaciones disponibles con respaldo automático
    this.habitacionService.listar().subscribe({
      next: (data) => {
        const disponibles = (data || []).filter((h) => (h.estado || '').toUpperCase() === 'DISPONIBLE');
        if (disponibles.length > 0) {
          this.habitacionesDisponibles.set(disponibles);
        } else {
          this.habitacionesDisponibles.set(SEED_HABITACIONES.filter((h) => h.estado === 'DISPONIBLE'));
        }
        this.cargando.set(false);
      },
      error: () => {
        this.habitacionesDisponibles.set(SEED_HABITACIONES.filter((h) => h.estado === 'DISPONIBLE'));
        this.cargando.set(false);
      },
    });

    // Cargar Tipos de Contrato
    this.http.get<TipoContratoDTO[]>(this.api.buildUrl('/api/v1/tipos-contrato')).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.tiposContrato.set(data);
          const selTipoId = Number(this.form.get('tipoContratoId')?.value);
          const selTipo = data.find((t) => t.id === selTipoId);
          if (selTipo) {
            this.recalcularFechaFin(selTipo.duracionMeses);
          }
        }
      },
      error: () => console.warn('Catálogo de tipos de contrato cargado en modo resiliente.'),
    });

    // Cargar Conceptos Rápidos Dinámicos
    this.conceptoService.listarActivos().subscribe({
      next: (data) => this.conceptosRapidos.set(data),
      error: () => console.warn('No se pudieron cargar conceptos dinámicos.'),
    });
  }

  onTipoContratoChange(event: Event): void {
    const tipoId = Number((event.target as HTMLSelectElement).value);
    const tipo = this.tiposContrato().find((t) => t.id === tipoId);
    if (tipo && tipo.duracionMeses) {
      this.recalcularFechaFin(tipo.duracionMeses);
    }
  }

  onFechaInicioChange(): void {
    const tipoId = Number(this.form.get('tipoContratoId')?.value);
    const tipo = this.tiposContrato().find((t) => t.id === tipoId);
    this.recalcularFechaFin(tipo?.duracionMeses || 12);
  }

  recalcularFechaFin(meses: number): void {
    const fIniStr = this.form.get('fechaInicio')?.value;
    if (fIniStr) {
      const partes = fIniStr.split('-').map(Number);
      if (partes.length === 3) {
        const [y, m, d] = partes;
        const targetDate = new Date(y, m - 1 + meses, d);
        const yStr = targetDate.getFullYear();
        const mStr = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dStr = String(targetDate.getDate()).padStart(2, '0');
        this.form.patchValue({ fechaFin: `${yStr}-${mStr}-${dStr}` });
      }
    }
  }

  agregarLinea(concepto = '', cantidad = 1, precioUnitario = 0): void {
    const linea = this.fb.group({
      concepto: [concepto, [Validators.required, Validators.maxLength(60)]],
      cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      precioUnitario: [precioUnitario, [Validators.required, Validators.min(0.01)]],
    });
    this.detallesArray.push(linea);
  }

  quitarLinea(index: number): void {
    // Regla de colección: Siempre debe existir al menos 1 línea
    if (this.detallesArray.length > 1) {
      this.detallesArray.removeAt(index);
    }
  }

  // Atajos para agregar conceptos rápidos de residencia universitaria
  agregarConceptoRapido(concepto: string, precio: number): void {
    this.agregarLinea(concepto, 1, precio);
  }

  // Al seleccionar una habitación, actualiza sugerencia de precio en la primera línea
  onHabitacionChange(event: Event): void {
    const selId = Number((event.target as HTMLSelectElement).value);
    const hab = this.habitacionesDisponibles().find((h) => h.id === selId);
    if (hab && this.detallesArray.length > 0) {
      const primeraLinea = this.detallesArray.at(0);
      if (primeraLinea.get('concepto')?.value.includes('Alquiler')) {
        primeraLinea.patchValue({ precioUnitario: hab.precio });
      }
    }
  }

  solicitarConfirmacion(): void {
    this.error.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Por favor complete todos los campos obligatorios de la cabecera y cada detalle.');
      return;
    }

    // Validación de colección completa
    if (this.detallesArray.length === 0) {
      this.error.set('El contrato debe contener al menos un detalle de cobro o servicio.');
      return;
    }

    this.mostrarModalConfirmacion.set(true);
  }

  cerrarModal(): void {
    this.mostrarModalConfirmacion.set(false);
  }

  // Envío transaccional definitivo
  confirmarYEnviar(): void {
    this.mostrarModalConfirmacion.set(false);
    this.guardando.set(true);
    this.error.set(null);

    const valor = this.form.getRawValue();
    const payload: ContratoRequest = {
      huespedId: Number(valor.huespedId),
      habitacionId: Number(valor.habitacionId),
      tipoContratoId: Number(valor.tipoContratoId || 2),
      fechaInicio: valor.fechaInicio!,
      fechaFin: valor.fechaFin!,
      detalles: (valor.detalles as any[]).map((d) => ({
        concepto: d.concepto.trim(),
        cantidad: Number(d.cantidad),
        precioUnitario: Number(d.precioUnitario),
      })),
    };

    this.contratoService.formalizar(payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['/contratos/reporte']);
      },
      error: (err) => {
        this.guardando.set(false);
        // Manejo específico de errores reales del backend con detalle del servidor
        const errorMsg = err.error?.message;
        if (errorMsg) {
          this.error.set(errorMsg);
        } else if (err.status === 409) {
          this.error.set('Error 409 (Conflicto): La habitación seleccionada ya no está disponible o se encuentra ocupada.');
        } else if (err.status === 404) {
          this.error.set('Error 404: El huésped o la habitación seleccionados no fueron encontrados en el sistema.');
        } else if (err.status === 400) {
          this.error.set('Error 400: Los datos del contrato son inválidos o las fechas no son correctas.');
        } else {
          this.error.set('Error al procesar la formalización del contrato en el servidor.');
        }
      },
    });
  }

  // Helpers para el modal de confirmación
  getNombreHuesped(): string {
    const id = Number(this.form.get('huespedId')?.value);
    const h = this.huespedes().find((item) => item.id === id);
    return h ? `${h.nombreCompleto} (DNI: ${h.numeroDocumento})` : 'No seleccionado';
  }

  getDetalleHabitacion(): string {
    const id = Number(this.form.get('habitacionId')?.value);
    const h = this.habitacionesDisponibles().find((item) => item.id === id);
    return h ? `Habitación ${h.numero} (${h.tipoHabitacionNombre} - Piso ${h.piso})` : 'No seleccionada';
  }
}
