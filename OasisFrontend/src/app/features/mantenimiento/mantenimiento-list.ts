import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MantenimientoService } from './mantenimiento-service';
import { ReporteMantenimiento, ReporteMantenimientoRequest } from './mantenimiento.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-mantenimiento-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mantenimiento-list.html',
  styleUrl: './mantenimiento-list.css',
})
export class MantenimientoList implements OnInit {
  private readonly mantenimientoService = inject(MantenimientoService);
  readonly authService = inject(AuthService);

  readonly reportes = signal<ReporteMantenimiento[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly selectedEstado = signal<string>('TODOS');
  readonly searchTerm = signal<string>('');

  // Modal State
  readonly isModalOpen = signal<boolean>(false);
  formModel: ReporteMantenimientoRequest = {
    habitacionId: 101,
    huespedId: 1,
    tipoAveria: 'Plomería / Sanitarios',
    descripcion: '',
  };

  readonly filteredReportes = computed(() => {
    let list = this.reportes();
    const estado = this.selectedEstado();
    if (estado !== 'TODOS') {
      list = list.filter((r) => r.estado === estado);
    }
    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      list = list.filter(
        (r) =>
          r.descripcion.toLowerCase().includes(term) ||
          r.tipoAveria.toLowerCase().includes(term) ||
          r.habitacionId.toString().includes(term)
      );
    }
    return list;
  });

  readonly stats = computed(() => {
    const list = this.reportes();
    return {
      pendientes: list.filter((r) => r.estado === 'PENDIENTE').length,
      enProceso: list.filter((r) => r.estado === 'EN_PROCESO').length,
      solucionados: list.filter((r) => r.estado === 'SOLUCIONADO').length,
      total: list.length,
    };
  });

  ngOnInit(): void {
    this.cargarReportes();
  }

  cargarReportes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.mantenimientoService.listarTodos().subscribe({
      next: (data) => {
        this.reportes.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar reportes:', err);
        this.error.set('No se pudo cargar la lista de incidencias.');
        this.loading.set(false);
      },
    });
  }

  abrirModalNuevo(): void {
    this.formModel = {
      habitacionId: 101,
      huespedId: 1,
      tipoAveria: 'Plomería / Sanitarios',
      descripcion: '',
    };
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
  }

  guardarReporte(): void {
    if (!this.formModel.descripcion || !this.formModel.habitacionId) {
      alert('Por favor ingrese la habitación y detalle el problema.');
      return;
    }

    this.mantenimientoService.crear(this.formModel).subscribe({
      next: () => {
        this.mostrarExito('Incidencia reportada correctamente. El equipo técnico la atenderá a la brevedad.');
        this.cerrarModal();
        this.cargarReportes();
      },
      error: (err) => {
        alert('Error al reportar avería: ' + (err.error?.message || err.message));
      },
    });
  }

  cambiarEstado(reporte: ReporteMantenimiento, nuevoEstado: string): void {
    if (!reporte.id) return;
    this.mantenimientoService.actualizarEstado(reporte.id, nuevoEstado).subscribe({
      next: () => {
        this.mostrarExito(`Incidencia #${reporte.id} actualizada a: ${nuevoEstado}`);
        this.cargarReportes();
      },
      error: (err) => {
        alert('Error al actualizar estado: ' + (err.error?.message || err.message));
      },
    });
  }

  private mostrarExito(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 4000);
  }
}
