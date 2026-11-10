import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TipoHabitacionService } from './tipo-habitacion-service';

@Component({
  selector: 'app-tipo-habitacion-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './tipo-habitacion-form.html',
  styleUrl: './tipo-habitacion-form.css',
})
export class TipoHabitacionForm {
  private readonly fb = inject(FormBuilder);
  private readonly tipoHabitacionService = inject(TipoHabitacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = signal<number | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly guardando = signal<boolean>(false);

  protected readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(255)]],
    precioBase: [350, [Validators.required, Validators.min(1)]],
    capacidadPersonas: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.tipoHabitacionService.obtener(id).subscribe({
        next: (tipo) => {
          this.form.patchValue(tipo);
        },
        error: () => {
          this.error.set('No se pudo cargar la información del tipo de habitación para editar.');
        },
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    const valor = this.form.getRawValue();
    const id = this.id();
    const peticion = id
      ? this.tipoHabitacionService.actualizar(id, valor)
      : this.tipoHabitacionService.crear(valor);

    peticion.subscribe({
      next: () => this.router.navigate(['/alojamiento/tipos-habitacion']),
      error: () => {
        this.error.set('No se pudo guardar el tipo de habitación. Verifique los datos o la conexión.');
        this.guardando.set(false);
      },
    });
  }
}