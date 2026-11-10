import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitacionService } from './habitacion-service';
import { TipoHabitacionService } from '../tipo-habitacion/tipo-habitacion-service';
import { TipoHabitacion } from '../tipo-habitacion/tipo-habitacion.model';
import { HabitacionRequest } from './habitacion.model';

@Component({
  selector: 'app-habitacion-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './habitacion-form.html',
  styleUrl: './habitacion-form.css',
})
export class HabitacionForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly habitacionService = inject(HabitacionService);
  private readonly tipoHabitacionService = inject(TipoHabitacionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly id = signal<number | null>(null);
  protected readonly tiposHabitacion = signal<TipoHabitacion[]>([]);
  protected readonly error = signal<string | null>(null);
  protected readonly guardando = signal<boolean>(false);
  protected readonly cargandoTipos = signal<boolean>(true);

  // Formulario Reactivo con validaciones Nivel 1
  protected readonly form = this.fb.nonNullable.group({
    numero: ['', [Validators.required, Validators.maxLength(20)]],
    piso: [1, [Validators.required, Validators.min(1), Validators.max(20)]],
    precio: [450, [Validators.required, Validators.min(1)]],
    estado: ['DISPONIBLE', [Validators.required]],
    tipoHabitacionId: [0, [Validators.required, Validators.min(1)]],
    amoblada: [false, [Validators.required]],
    tipoBano: ['COMPARTIDO', [Validators.required]],
  });

  ngOnInit(): void {
    this.cargarTiposHabitacion();
  }

  private cargarTiposHabitacion(): void {
    this.tipoHabitacionService.listar().subscribe({
      next: (tipos) => {
        this.tiposHabitacion.set(tipos);
        this.cargandoTipos.set(false);
        this.verificarModoEdicion();
      },
      error: () => {
        this.error.set('No se pudo cargar el catálogo de tipos de habitación (entidad padre).');
        this.cargandoTipos.set(false);
      },
    });
  }

  private verificarModoEdicion(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      this.id.set(id);
      this.habitacionService.obtener(id).subscribe({
        next: (hab) => {
          this.form.patchValue({
            numero: hab.numero,
            piso: hab.piso,
            precio: hab.precio,
            estado: hab.estado,
            tipoHabitacionId: hab.tipoHabitacionId,
            amoblada: hab.amoblada ?? false,
            tipoBano: hab.tipoBano ?? 'COMPARTIDO',
          });
        },
        error: () => {
          this.error.set('No se pudo cargar la información de la habitación física para edición.');
        },
      });
    }
  }

  onTipoHabitacionChange(tipoId: number): void {
    // Al seleccionar un tipo padre, sugiere automáticamente el precioBase de dicho tipo si es nuevo registro
    if (!this.id()) {
      const seleccionado = this.tiposHabitacion().find((t) => t.id === tipoId);
      if (seleccionado) {
        this.form.patchValue({ precio: seleccionado.precioBase });
      }
    }
  }

  guardar(): void {
    // Validación Nivel 1: Controles de Angular Form
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valor = this.form.getRawValue();

    // Validación Nivel 2: Regla de dependencia lógica de negocio (clave foránea positiva obligatoria)
    if (!valor.tipoHabitacionId || valor.tipoHabitacionId <= 0) {
      this.error.set('Validación fallida: Debe seleccionar obligatoriamente un tipo de habitación válido del catálogo.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const payload: HabitacionRequest = {
      numero: valor.numero.trim(),
      piso: Number(valor.piso),
      precio: Number(valor.precio),
      estado: valor.estado,
      tipoHabitacionId: Number(valor.tipoHabitacionId),
      amoblada: Boolean(valor.amoblada),
      tipoBano: valor.tipoBano || 'COMPARTIDO',
    };

    const id = this.id();
    const peticion = id
      ? this.habitacionService.actualizar(id, payload)
      : this.habitacionService.crear(payload);

    peticion.subscribe({
      next: () => this.router.navigate(['/alojamiento/habitaciones']),
      // Validación Nivel 3: Manejo de errores devueltos por el backend Spring Boot
      error: (err) => {
        const errorMsg = err.error?.message;
        if (errorMsg) {
          this.error.set(errorMsg);
        } else if (err.status === 400) {
          this.error.set('Error 400: Los datos enviados no cumplen las restricciones del servidor.');
        } else if (err.status === 404) {
          this.error.set('Error 404: El tipo de habitación especificado no existe en la base de datos.');
        } else {
          this.error.set('Error al procesar la solicitud en el backend. Verifique la conexión con el servidor.');
        }
        this.guardando.set(false);
      },
    });
  }
}
