import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConceptoContratoService } from './concepto-contrato.service';
import { ConceptoContrato } from './concepto-contrato.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-concepto-contrato-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './concepto-contrato-list.html',
  styleUrl: './concepto-contrato-list.css'
})
export class ConceptoContratoList implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly conceptoService = inject(ConceptoContratoService);
  protected readonly authService = inject(AuthService);

  protected readonly conceptos = signal<ConceptoContrato[]>([]);
  protected readonly cargando = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly exito = signal<string | null>(null);

  // Modal State
  protected readonly mostrarModal = signal<boolean>(false);
  protected readonly editandoId = signal<number | null>(null);

  // Preset icons for easy picking
  protected readonly iconosDisponibles = ['🛡️', '🌐', '🚗', '🧊', '♨️', '🧹', '📦', '💧', '🖨️', '🔑', '🏷️'];
  protected readonly categoriasDisponibles = ['GARANTIA', 'SERVICIO', 'COCHERA', 'EQUIPAMIENTO', 'OTRO'];

  protected readonly form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.maxLength(255)]],
    precioSugerido: [50.00, [Validators.required, Validators.min(0.01)]],
    categoria: ['SERVICIO', [Validators.required]],
    icono: ['🏷️', [Validators.required]],
    activo: [true]
  });

  ngOnInit(): void {
    this.cargarConceptos();
  }

  cargarConceptos(): void {
    this.cargando.set(true);
    this.error.set(null);
    this.conceptoService.listarTodos().subscribe({
      next: (data) => {
        this.conceptos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error cargando conceptos', err);
        this.error.set('No se pudieron cargar los conceptos de contrato.');
        this.cargando.set(false);
      }
    });
  }

  abrirModalCrear(): void {
    this.editandoId.set(null);
    this.form.reset({
      nombre: '',
      descripcion: '',
      precioSugerido: 50.00,
      categoria: 'SERVICIO',
      icono: '🏷️',
      activo: true
    });
    this.mostrarModal.set(true);
  }

  abrirModalEditar(item: ConceptoContrato): void {
    this.editandoId.set(item.id ?? null);
    this.form.patchValue({
      nombre: item.nombre,
      descripcion: item.descripcion || '',
      precioSugerido: item.precioSugerido,
      categoria: item.categoria || 'SERVICIO',
      icono: item.icono || '🏷️',
      activo: item.activo ?? true
    });
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.editandoId.set(null);
  }

  seleccionarIcono(ico: string): void {
    this.form.patchValue({ icono: ico });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const dto: ConceptoContrato = {
      nombre: val.nombre,
      descripcion: val.descripcion,
      precioSugerido: Number(val.precioSugerido),
      categoria: val.categoria,
      icono: val.icono,
      activo: val.activo
    };

    const id = this.editandoId();
    if (id) {
      this.conceptoService.actualizar(id, dto).subscribe({
        next: () => {
          this.exito.set('Concepto actualizado exitosamente.');
          this.cerrarModal();
          this.cargarConceptos();
          setTimeout(() => this.exito.set(null), 4000);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error al actualizar el concepto.');
        }
      });
    } else {
      this.conceptoService.crear(dto).subscribe({
        next: () => {
          this.exito.set('Nuevo concepto creado exitosamente.');
          this.cerrarModal();
          this.cargarConceptos();
          setTimeout(() => this.exito.set(null), 4000);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Error al crear el concepto.');
        }
      });
    }
  }

  eliminar(item: ConceptoContrato): void {
    if (!item.id) return;
    if (confirm(`¿Está seguro de eliminar el concepto "${item.nombre}"?`)) {
      this.conceptoService.eliminar(item.id).subscribe({
        next: () => {
          this.exito.set(`Concepto "${item.nombre}" eliminado.`);
          this.cargarConceptos();
          setTimeout(() => this.exito.set(null), 4000);
        },
        error: (err) => {
          console.error(err);
          this.error.set('No se pudo eliminar el concepto (puede tener detalles asociados).');
        }
      });
    }
  }
}
