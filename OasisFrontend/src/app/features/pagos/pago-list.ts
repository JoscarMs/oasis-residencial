import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagoService } from './pago-service';
import { Pago, PagoRequest, ReporteIngresos } from './pago.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-pago-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago-list.html',
  styleUrl: './pago-list.css',
})
export class PagoList implements OnInit {
  private readonly pagoService = inject(PagoService);
  readonly authService = inject(AuthService);

  readonly pagos = signal<Pago[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly reporte = signal<ReporteIngresos | null>(null);

  readonly searchTerm = signal<string>('');
  readonly selectedMetodo = signal<string>('TODOS');

  // Modal State
  readonly isModalOpen = signal<boolean>(false);
  formModel: PagoRequest = {
    contratoId: 1,
    monto: 350.0,
    fechaPago: new Date().toISOString().substring(0, 10),
    metodoPago: 'TRANSFERENCIA',
    estado: 'PAGADO',
    numeroComprobante: 'REC-' + Math.floor(100000 + Math.random() * 900000),
  };

  readonly filteredPagos = computed(() => {
    let list = this.pagos();
    const metodo = this.selectedMetodo();
    if (metodo !== 'TODOS') {
      list = list.filter((p) => p.metodoPago === metodo);
    }
    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      list = list.filter(
        (p) =>
          p.numeroComprobante.toLowerCase().includes(term) ||
          p.contratoId.toString().includes(term) ||
          p.monto.toString().includes(term)
      );
    }
    return list;
  });

  readonly totalMonto = computed(() => {
    return this.filteredPagos().reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.pagoService.listar().subscribe({
      next: (data) => {
        this.pagos.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar pagos:', err);
        this.error.set('Error al cargar los pagos: ' + (err.error?.message || err.statusText));
        this.loading.set(false);
      },
    });

    if (this.authService.isAdmin() || this.authService.isSupervisor()) {
      this.pagoService.reporteAnual(2026).subscribe({
        next: (rep) => this.reporte.set(rep),
        error: () => {},
      });
    }
  }

  abrirModalNuevo(): void {
    this.formModel = {
      contratoId: 1,
      monto: 350.0,
      fechaPago: new Date().toISOString().substring(0, 10),
      metodoPago: 'TRANSFERENCIA',
      estado: 'PAGADO',
      numeroComprobante: 'REC-' + Math.floor(100000 + Math.random() * 900000),
    };
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
  }

  guardarPago(): void {
    if (!this.formModel.contratoId || !this.formModel.monto || this.formModel.monto <= 0) {
      alert('Ingrese un contrato y un monto válido.');
      return;
    }

    this.pagoService.crear(this.formModel).subscribe({
      next: () => {
        this.successMessage.set('Pago registrado satisfactoriamente');
        setTimeout(() => this.successMessage.set(null), 4000);
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        alert('Error al registrar pago: ' + (err.error?.message || err.message));
      },
    });
  }

  probarAccesoDenegado(): void {
    // Attempt to access payment #4 (belongs to another resident)
    this.pagoService.obtener(4).subscribe({
      next: (res) => {
        alert(`Acceso concedido al pago #${res.id} (Monto: $${res.monto})`);
      },
      error: (err) => {
        if (err.status === 403) {
          alert('🚫 [ABAC 403 Prohibido]: No tienes autorización para consultar el pago #4 de otro residente.');
        } else {
          alert(`Error ${err.status}: ${err.error?.message || err.message}`);
        }
      },
    });
  }
}
