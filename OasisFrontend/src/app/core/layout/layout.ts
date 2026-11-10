import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, SEED_USERS } from '../auth/auth-service';
import { CuentaService } from '../../features/seguridad/cuenta.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cuentaService = inject(CuentaService);

  readonly seedUsers = SEED_USERS;

  // Modal Cambiar Contraseña
  readonly modalPasswordAbierto = signal<boolean>(false);
  passActual = '';
  passNueva = '';
  passConfirm = '';
  readonly errorPassword = signal<string | null>(null);
  readonly exitoPassword = signal<string | null>(null);
  readonly guardandoPassword = signal<boolean>(false);

  abrirModalPassword(): void {
    this.passActual = '';
    this.passNueva = '';
    this.passConfirm = '';
    this.errorPassword.set(null);
    this.exitoPassword.set(null);
    this.modalPasswordAbierto.set(true);
  }

  cerrarModalPassword(): void {
    this.modalPasswordAbierto.set(false);
  }

  ejecutarCambioPassword(): void {
    if (!this.passActual) {
      this.errorPassword.set('Debe ingresar su contraseña actual.');
      return;
    }
    if (!this.passNueva || this.passNueva.length < 4) {
      this.errorPassword.set('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (this.passNueva !== this.passConfirm) {
      this.errorPassword.set('Las nuevas contraseñas no coinciden.');
      return;
    }

    this.guardandoPassword.set(true);
    this.errorPassword.set(null);
    this.cuentaService.cambiarPassword(this.passActual, this.passNueva).subscribe({
      next: () => {
        this.guardandoPassword.set(false);
        this.exitoPassword.set('¡Contraseña cambiada exitosamente!');
        setTimeout(() => {
          this.cerrarModalPassword();
        }, 1500);
      },
      error: (err) => {
        this.guardandoPassword.set(false);
        this.errorPassword.set(err.error?.message || 'Error al cambiar contraseña. Verifique que la contraseña actual sea correcta.');
      },
    });
  }

  onUserChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const username = target.value;
    this.authService.loginWithSeedUser(username);
    if (this.authService.isResidente()) {
      this.router.navigate(['/mi-habitacion']);
    } else {
      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
    }
  }

  onQuickLogin(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const username = target.value;
    if (username) {
      this.loginAs(username);
    }
  }

  loginAs(username: string): void {
    this.authService.loginWithSeedUser(username);
    this.authService.keycloakInaccesible.set(false);
    if (this.authService.isResidente()) {
      this.router.navigate(['/mi-habitacion']);
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  iniciarLogin(): void {
    this.authService.iniciarLogin();
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
  }
}
