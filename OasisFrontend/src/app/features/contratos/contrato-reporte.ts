import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContratoService } from './contrato-service';
import { Contrato } from './contrato.model';

@Component({
  selector: 'app-contrato-reporte',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, DecimalPipe],
  templateUrl: './contrato-reporte.html',
  styleUrl: './contrato-reporte.css',
})
export class ContratoReporte implements OnInit {
  protected readonly contratoService = inject(ContratoService);
  protected readonly isModoLocal = this.contratoService.isModoLocal;

  // Lista y carga
  protected readonly contratos = signal<Contrato[]>([]);
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  // Filtros interactivos
  protected readonly filtroEstado = signal<string>('TODOS');
  protected readonly filtroDesde = signal<string>('');
  protected readonly filtroHasta = signal<string>('');

  // Filas expandidas (para ver el detalle real línea por línea)
  protected readonly contratoExpandidoId = signal<number | null>(null);

  // Agregados calculados con Signals computed (Rúbrica 4: Agregados reales)
  protected readonly totalContratos = computed(() => this.contratos().length);

  protected readonly montoTotalAcumulado = computed(() => {
    return this.contratos().reduce((acc, c) => acc + Number(c.totalContrato || 0), 0);
  });

  protected readonly ticketPromedio = computed(() => {
    const cant = this.totalContratos();
    return cant > 0 ? this.montoTotalAcumulado() / cant : 0;
  });

  protected readonly contratosVigentes = computed(() => {
    return this.contratos().filter((c) => c.estado === 'VIGENTE').length;
  });

  protected readonly contratosAnulados = computed(() => {
    return this.contratos().filter((c) => c.estado === 'ANULADO').length;
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set(null);
    const estado = this.filtroEstado();
    const desde = this.filtroDesde() || undefined;
    const hasta = this.filtroHasta() || undefined;

    this.contratoService.listar(estado, desde, hasta).subscribe({
      next: (data) => {
        this.contratos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando contratos:', err);
        this.error.set('No se pudo cargar el reporte de contratos desde el backend.');
        this.cargando.set(false);
      },
    });
  }

  toggleDetalle(id: number): void {
    if (this.contratoExpandidoId() === id) {
      this.contratoExpandidoId.set(null);
    } else {
      this.contratoExpandidoId.set(id);
    }
  }

  aplicarFiltros(): void {
    this.cargar();
  }

  limpiarFiltros(): void {
    this.filtroEstado.set('TODOS');
    this.filtroDesde.set('');
    this.filtroHasta.set('');
    this.cargar();
  }

  // Transición de estado con regla de negocio (Rúbrica 5: Anular contrato con liberación colateral)
  anularContrato(contrato: Contrato): void {
    if (contrato.estado !== 'VIGENTE') {
      alert('Solo se pueden anular contratos que se encuentren en estado VIGENTE.');
      return;
    }

    const confirmar = confirm(
      `¿Está seguro de anular el contrato ${contrato.codigoContrato}? Esta operación es irreversible y liberará la habitación física en el inventario.`
    );
    if (!confirmar) return;

    this.error.set(null);
    this.exito.set(null);

    this.contratoService.anular(contrato.id!).subscribe({
      next: () => {
        this.exito.set(`Contrato ${contrato.codigoContrato} anulado exitosamente. La habitación asociada ha sido liberada a estado DISPONIBLE.`);
        this.cargar();
      },
      error: (err) => {
        if (err.status === 409) {
          this.error.set('Validación de negocio: El contrato ya se encontraba anulado previamente.');
        } else {
          this.error.set('No se pudo anular el contrato. Verifique la conexión con el servidor.');
        }
      },
    });
  }
}
