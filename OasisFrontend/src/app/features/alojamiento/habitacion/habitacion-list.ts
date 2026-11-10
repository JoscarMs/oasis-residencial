import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from './habitacion-service';
import { Habitacion } from './habitacion.model';
import { TipoHabitacionService } from '../tipo-habitacion/tipo-habitacion-service';
import { TipoHabitacion } from '../tipo-habitacion/tipo-habitacion.model';

@Component({
  selector: 'app-habitacion-list',
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './habitacion-list.html',
  styleUrl: './habitacion-list.css',
})
export class HabitacionList implements OnInit {
  private readonly habitacionService = inject(HabitacionService);
  private readonly tipoHabitacionService = inject(TipoHabitacionService);

  protected readonly habitaciones = signal<Habitacion[]>([]);
  protected readonly tiposHabitacion = signal<TipoHabitacion[]>([]);
  protected readonly filtroTipoId = signal<number>(0);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);
  protected readonly cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarTipos();
    this.cargarHabitaciones();
  }

  cargarTipos(): void {
    this.tipoHabitacionService.listar().subscribe({
      next: (tipos) => this.tiposHabitacion.set(tipos),
      error: () => console.error('Error al cargar tipos de habitación para el filtro'),
    });
  }

  cargarHabitaciones(): void {
    this.cargando.set(true);
    const tipoId = this.filtroTipoId();
    this.habitacionService.listar(tipoId > 0 ? tipoId : undefined).subscribe({
      next: (data) => {
        this.habitaciones.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el backend o cargar el inventario de habitaciones.');
        this.cargando.set(false);
      },
    });
  }

  onFiltroChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filtroTipoId.set(Number(target.value));
    this.cargarHabitaciones();
  }

  eliminar(id: number, numero: string): void {
    if (!confirm(`¿Está seguro de eliminar la habitación física N° ${numero}?`)) {
      return;
    }
    this.error.set(null);
    this.exito.set(null);
    this.habitacionService.eliminar(id).subscribe({
      next: () => {
        this.exito.set(`Habitación N° ${numero} eliminada exitosamente del inventario.`);
        this.cargarHabitaciones();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409 || err.status === 500) {
          this.error.set(`No se puede eliminar la habitación ${numero}: posee reservas activas o registros vinculados.`);
        } else {
          this.error.set(`Error al intentar eliminar la habitación ${numero}.`);
        }
      },
    });
  }
}
