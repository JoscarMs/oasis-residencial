import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HuespedService } from './huesped-service';
import { Huesped, HuespedRequest } from './huesped.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-huesped-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './huesped-list.html',
  styleUrl: './huesped-list.css',
})
export class HuespedList implements OnInit {
  private readonly huespedService = inject(HuespedService);
  readonly authService = inject(AuthService);

  readonly huespedes = signal<Huesped[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly searchTerm = signal<string>('');
  readonly buscandoDocumento = signal<boolean>(false);
  readonly mensajeBusqueda = signal<string | null>(null);

  // Modal State
  readonly isModalOpen = signal<boolean>(false);
  readonly isEditing = signal<boolean>(false);
  readonly editingId = signal<number | null>(null);

  formModel: HuespedRequest = {
    nombreCompleto: '',
    email: '',
    telefono: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    perfil: 'ESTUDIANTE',
    esMenorDeEdad: false,
    nombreApoderado: '',
    telefonoApoderado: '',
    dniApoderado: '',
    parentesco: '',
  };

  readonly filteredHuespedes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.huespedes();
    return this.huespedes().filter(
      (h) =>
        h.nombreCompleto.toLowerCase().includes(term) ||
        h.numeroDocumento.includes(term) ||
        h.email.toLowerCase().includes(term) ||
        (h.perfil && h.perfil.toLowerCase().includes(term))
    );
  });

  ngOnInit(): void {
    this.cargarHuespedes();
  }

  cargarHuespedes(): void {
    this.loading.set(true);
    this.error.set(null);
    this.huespedService.listar().subscribe({
      next: (data) => {
        this.huespedes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar huéspedes:', err);
        this.error.set('No se pudo cargar la lista de residentes. Verifique la conexión.');
        this.loading.set(false);
      },
    });
  }

  abrirModalNuevo(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.formModel = {
      nombreCompleto: '',
      email: '',
      telefono: '',
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      perfil: 'ESTUDIANTE',
      esMenorDeEdad: false,
      nombreApoderado: '',
      telefonoApoderado: '',
      dniApoderado: '',
      parentesco: '',
    };
    this.isModalOpen.set(true);
  }

  abrirModalEditar(h: Huesped): void {
    this.isEditing.set(true);
    this.editingId.set(h.id ?? null);
    this.formModel = {
      nombreCompleto: h.nombreCompleto,
      email: h.email,
      telefono: h.telefono || '',
      tipoDocumento: h.tipoDocumento || 'DNI',
      numeroDocumento: h.numeroDocumento,
      perfil: h.perfil || 'ESTUDIANTE',
      esMenorDeEdad: !!h.esMenorDeEdad,
      nombreApoderado: h.nombreApoderado || '',
      telefonoApoderado: h.telefonoApoderado || '',
      dniApoderado: h.dniApoderado || '',
      parentesco: h.parentesco || '',
    };
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
    this.mensajeBusqueda.set(null);
  }

  /** Consulta RENIEC (DNI) o SUNAT (RUC) y autocompleta el nombre. */
  buscarDocumento(): void {
    const doc = this.formModel.numeroDocumento?.trim();
    if (!doc) return;
    this.buscandoDocumento.set(true);
    this.mensajeBusqueda.set(null);
    this.huespedService.consultarIdentidad(this.formModel.tipoDocumento || 'DNI', doc).subscribe({
      next: (r) => {
        this.formModel.nombreCompleto = r.nombreCompleto;
        this.mensajeBusqueda.set('✅ Datos encontrados: ' + r.nombreCompleto);
        this.buscandoDocumento.set(false);
      },
      error: (err) => {
        this.mensajeBusqueda.set('⚠️ ' + (err.error?.message || err.error?.detail || 'No se pudo consultar. Puede escribir el nombre manualmente.'));
        this.buscandoDocumento.set(false);
      },
    });
  }

  guardar(): void {
    if (!this.formModel.numeroDocumento?.trim()) {
      alert('Ingrese el número de documento (DNI o RUC).');
      return;
    }
    const esConsultable = this.formModel.tipoDocumento === 'DNI' || this.formModel.tipoDocumento === 'RUC';
    if (!esConsultable && (!this.formModel.nombreCompleto || !this.formModel.email)) {
      alert('Para este tipo de documento complete Nombre y Email.');
      return;
    }

    if (this.isEditing() && this.editingId()) {
      this.huespedService.actualizar(this.editingId()!, this.formModel).subscribe({
        next: () => {
          this.mostrarExito('Residente actualizado exitosamente');
          this.cerrarModal();
          this.cargarHuespedes();
        },
        error: (err) => {
          alert('Error al actualizar residente: ' + (err.error?.message || err.message));
        },
      });
    } else {
      this.huespedService.crear(this.formModel).subscribe({
        next: () => {
          this.mostrarExito('Residente registrado exitosamente');
          this.cerrarModal();
          this.cargarHuespedes();
        },
        error: (err) => {
          alert('Error al registrar residente: ' + (err.error?.message || err.message));
        },
      });
    }
  }

  eliminar(h: Huesped): void {
    if (!h.id) return;
    if (confirm(`¿Está seguro de eliminar al residente ${h.nombreCompleto}?`)) {
      this.huespedService.eliminar(h.id).subscribe({
        next: () => {
          this.mostrarExito('Residente eliminado');
          this.cargarHuespedes();
        },
        error: (err) => {
          alert('Error al eliminar residente: ' + (err.error?.message || err.message));
        },
      });
    }
  }

  private mostrarExito(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 4000);
  }
}
