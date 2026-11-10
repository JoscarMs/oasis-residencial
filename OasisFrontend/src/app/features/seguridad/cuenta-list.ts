import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CuentaService, CuentaUsuarioDTO } from './cuenta.service';

@Component({
  selector: 'app-cuenta-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta-list.html',
  styleUrls: ['./cuenta-list.css'],
})
export class CuentaList implements OnInit {
  private readonly cuentaService = inject(CuentaService);

  readonly cuentas = signal<CuentaUsuarioDTO[]>([]);
  readonly cargando = signal<boolean>(false);
  readonly filtroTexto = signal<string>('');
  readonly filtroRol = signal<string>('TODOS');
  readonly verPasswordMap = signal<Record<number, boolean>>({});
  readonly mensajeExito = signal<string | null>(null);

  readonly cuentasFiltradas = computed(() => {
    const texto = this.filtroTexto().toLowerCase().trim();
    const rol = this.filtroRol();

    return this.cuentas().filter((c) => {
      const matchTexto =
        !texto ||
        c.username.toLowerCase().includes(texto) ||
        (c.nombreCompleto && c.nombreCompleto.toLowerCase().includes(texto)) ||
        (c.numeroDocumento && c.numeroDocumento.includes(texto));

      const matchRol =
        rol === 'TODOS' ||
        (rol === 'RESIDENTES' && c.rol.includes('RESIDENTE')) ||
        (rol === 'STAFF' && !c.rol.includes('RESIDENTE'));

      return matchTexto && matchRol;
    });
  });

  readonly totalCuentas = computed(() => this.cuentas().length);
  readonly totalResidentes = computed(() => this.cuentas().filter(c => c.rol.includes('RESIDENTE')).length);
  readonly totalActivos = computed(() => this.cuentas().filter(c => c.activo).length);

  ngOnInit(): void {
    this.cargarCuentas();
  }

  cargarCuentas(): void {
    this.cargando.set(true);
    this.cuentaService.listar().subscribe({
      next: (data) => {
        this.cuentas.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      },
    });
  }

  toggleVerPassword(id: number): void {
    const actual = { ...this.verPasswordMap() };
    actual[id] = !actual[id];
    this.verPasswordMap.set(actual);
  }

  resetPassword(cuenta: CuentaUsuarioDTO): void {
    if (confirm(`¿Restablecer la contraseña del usuario ${cuenta.username} a la clave base "123456"?`)) {
      this.cuentaService.resetPassword(cuenta.id).subscribe({
        next: () => {
          this.mostrarMensaje(`Contraseña de ${cuenta.username} restablecida a 123456 con éxito.`);
          this.cargarCuentas();
        },
        error: () => alert('Error al restablecer la contraseña'),
      });
    }
  }

  toggleActivo(cuenta: CuentaUsuarioDTO): void {
    const accion = cuenta.activo ? 'desactivar' : 'activar';
    if (confirm(`¿Está seguro de ${accion} la cuenta de ${cuenta.username}?`)) {
      this.cuentaService.toggleActivo(cuenta.id).subscribe({
        next: () => {
          this.mostrarMensaje(`Cuenta de ${cuenta.username} actualizada correctamente.`);
          this.cargarCuentas();
        },
        error: () => alert('Error al cambiar estado de la cuenta'),
      });
    }
  }

  mostrarMensaje(msg: string): void {
    this.mensajeExito.set(msg);
    setTimeout(() => this.mensajeExito.set(null), 4000);
  }
}
