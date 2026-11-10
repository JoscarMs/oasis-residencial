import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvisoService } from './aviso-service';
import { Aviso } from './aviso.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-aviso-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aviso-list.html',
  styleUrl: './aviso-list.css',
})
export class AvisoList implements OnInit {
  private readonly avisoService = inject(AvisoService);
  readonly authService = inject(AuthService);

  readonly avisos = signal<Aviso[]>([]);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  // Modal State
  readonly isModalOpen = signal<boolean>(false);
  formModel: Partial<Aviso> = {
    titulo: '',
    contenido: '',
    categoria: 'EVENTO',
    fijado: false,
    activo: true,
  };

  ngOnInit(): void {
    this.cargarAvisos();
  }

  cargarAvisos(): void {
    this.loading.set(true);
    this.error.set(null);
    this.avisoService.listar().subscribe({
      next: (data) => {
        this.avisos.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la cartelera de avisos.');
        this.loading.set(false);
      },
    });
  }

  abrirModalNuevo(): void {
    this.formModel = {
      titulo: '',
      contenido: '',
      categoria: 'EVENTO',
      fijado: false,
      activo: true,
    };
    this.isModalOpen.set(true);
  }

  cerrarModal(): void {
    this.isModalOpen.set(false);
  }

  guardarAviso(): void {
    if (!this.formModel.titulo || !this.formModel.contenido) {
      alert('Por favor complete el título y el contenido del comunicado.');
      return;
    }

    this.avisoService.crear(this.formModel).subscribe({
      next: () => {
        this.mostrarExito('Comunicado publicado exitosamente en la cartelera');
        this.cerrarModal();
        this.cargarAvisos();
      },
      error: (err) => {
        alert('Error al publicar aviso: ' + (err.error?.message || err.message));
      },
    });
  }

  eliminarAviso(id?: number): void {
    if (!id) return;
    if (confirm('¿Desea retirar este comunicado de la cartelera?')) {
      this.avisoService.eliminar(id).subscribe({
        next: () => {
          this.mostrarExito('Aviso retirado de la cartelera');
          this.cargarAvisos();
        },
        error: (err) => {
          alert('Error al eliminar aviso: ' + (err.error?.message || err.message));
        },
      });
    }
  }

  private mostrarExito(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 4000);
  }
}