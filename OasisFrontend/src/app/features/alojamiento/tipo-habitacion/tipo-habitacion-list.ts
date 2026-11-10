import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { TipoHabitacionService } from './tipo-habitacion-service';
import { TipoHabitacion } from './tipo-habitacion.model';

@Component({
  selector: 'app-tipo-habitacion-list',
  imports: [RouterLink],
  templateUrl: './tipo-habitacion-list.html',
  styleUrl: './tipo-habitacion-list.css',
})
export class TipoHabitacionList implements OnInit {
  private readonly tipoHabitacionService = inject(TipoHabitacionService);

  protected readonly tipos = signal<TipoHabitacion[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.tipoHabitacionService.listar().subscribe({
      next: (data) => {
        this.tipos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con el backend o cargar la lista de tipos de habitación.');
        this.cargando.set(false);
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Está seguro de eliminar este tipo de habitación?')) {
      return;
    }
    this.error.set(null);
    this.tipoHabitacionService.eliminar(id).subscribe({
      next: () => this.cargar(),
      error: (err: HttpErrorResponse) => {
        if (err.status === 500 || err.status === 409) {
          this.error.set('No se puede eliminar: existen habitaciones físicas asociadas a este tipo en el inventario.');
        } else {
          this.error.set('No se pudo eliminar el tipo de habitación.');
        }
      },
    });
  }
}