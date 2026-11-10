import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-sin-permiso',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="denied-container">
      <div class="denied-card">
        <div class="denied-icon">🛡️</div>
        <h2>Acceso Restringido (403)</h2>
        <p class="desc">
          Tu usuario actual (<strong>{{ auth.usuario()?.nombre || 'Usuario' }}</strong>) con rol(es)
          <span class="roles-badge">{{ auth.roles().join(', ') || 'Sin rol' }}</span>
          no cuenta con los privilegios requeridos para acceder a esta sección de la Residencia OASIS.
        </p>

        <div class="info-box">
          <p>
            ℹ️ Las operaciones administrativas de formalización de contratos, configuración de precios y mantenimiento están reservadas para
            <strong>ADMIN</strong> y <strong>SUPERVISOR</strong>, mientras que la sección de pagos y compras sigue reglas <strong>ABAC</strong>.
          </p>
        </div>

        <div class="actions">
          <a routerLink="/inicio" class="btn btn-gold">Ir al Inicio / Dashboard</a>
          <button type="button" class="btn btn-secondary" (click)="auth.cerrarSesion()">Cambiar de Cuenta</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .denied-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 65vh;
      font-family: 'Outfit', 'Inter', sans-serif;
    }
    .denied-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 5px solid #d1a153;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 580px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(26, 37, 47, 0.08);
    }
    .denied-icon {
      font-size: 3.5rem;
      margin-bottom: 0.75rem;
    }
    h2 {
      margin: 0 0 0.75rem 0;
      color: #1a252f;
      font-size: 1.5rem;
      font-weight: 700;
    }
    .desc {
      color: #475569;
      font-size: 0.92rem;
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }
    .roles-badge {
      background: #fdf8ee;
      border: 1px solid #e6c88b;
      color: #b88a3e;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.82rem;
    }
    .info-box {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 0.85rem 1rem;
      margin-bottom: 1.75rem;
      text-align: left;
    }
    .info-box p {
      margin: 0;
      color: #64748b;
      font-size: 0.82rem;
      line-height: 1.45;
    }
    .actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
    }
    .btn {
      padding: 0.65rem 1.25rem;
      border-radius: 6px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: all 0.2s ease;
      border: none;
    }
    .btn-gold {
      background: linear-gradient(135deg, #d1a153 0%, #b88a3e 100%);
      color: #ffffff;
      box-shadow: 0 2px 6px rgba(209, 161, 83, 0.3);
    }
    .btn-gold:hover {
      background: linear-gradient(135deg, #b88a3e 0%, #9e752e 100%);
    }
    .btn-secondary {
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
  `]
})
export class SinPermiso {
  protected readonly auth = inject(AuthService);
}
