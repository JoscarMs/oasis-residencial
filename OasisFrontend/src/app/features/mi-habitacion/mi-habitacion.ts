import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { PagoService } from '../pagos/pago-service';
import { Pago } from '../pagos/pago.model';
import { MantenimientoService } from '../mantenimiento/mantenimiento-service';
import { ReporteMantenimientoRequest } from '../mantenimiento/mantenimiento.model';

interface Roommate {
  nombre: string;
  email: string;
  carrera: string;
  estado: string;
}

@Component({
  selector: 'app-mi-habitacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mi-habitacion.html',
  styleUrl: './mi-habitacion.css',
})
export class MiHabitacion implements OnInit {
  readonly authService = inject(AuthService);
  private readonly pagoService = inject(PagoService);
  private readonly mantenimientoService = inject(MantenimientoService);

  readonly misPagos = signal<Pago[]>([]);
  readonly loadingPagos = signal<boolean>(true);
  readonly successMessage = signal<string | null>(null);

  // Modal reportar avería
  readonly isAveriaModalOpen = signal<boolean>(false);
  averiaModel: ReporteMantenimientoRequest = {
    habitacionId: 101,
    huespedId: 1,
    tipoAveria: 'Plomería / Sanitarios',
    descripcion: '',
  };

  readonly roommates = signal<Roommate[]>([
    {
      nombre: 'Mateo Ramos',
      email: 'mateo.ramos@upeu.edu.pe',
      carrera: 'Ingeniería de Sistemas',
      estado: 'Activo',
    },
    {
      nombre: 'Lucas Benítez',
      email: 'lucas.b@upeu.edu.pe',
      carrera: 'Administración de Empresas',
      estado: 'Activo',
    },
  ]);

  ngOnInit(): void {
    this.cargarMisPagos();
    // Adjust room number based on user
    if (this.authService.currentUsername() === 'residente2') {
      this.averiaModel.habitacionId = 201;
      this.averiaModel.huespedId = 2;
    }
  }

  cargarMisPagos(): void {
    this.loadingPagos.set(true);
    this.pagoService.listar().subscribe({
      next: (data) => {
        this.misPagos.set(data);
        this.loadingPagos.set(false);
      },
      error: () => {
        this.loadingPagos.set(false);
      },
    });
  }

  abrirReportarAveria(): void {
    this.averiaModel.descripcion = '';
    this.isAveriaModalOpen.set(true);
  }

  cerrarReportarAveria(): void {
    this.isAveriaModalOpen.set(false);
  }

  enviarReporteAveria(): void {
    if (!this.averiaModel.descripcion) {
      alert('Por favor describa el problema.');
      return;
    }

    this.mantenimientoService.crear(this.averiaModel).subscribe({
      next: () => {
        this.mostrarExito('¡Avería reportada al equipo de mantenimiento de OASIS con éxito!');
        this.cerrarReportarAveria();
      },
      error: (err) => {
        alert('Error al reportar avería: ' + (err.error?.message || err.message));
      },
    });
  }

  private mostrarExito(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 4000);
  }
}
