import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api-service';
import { SEED_USERS } from '../../core/auth/auth-service';

export interface CuentaUsuarioDTO {
  id: number;
  username: string;
  rol: string;
  huespedId?: number;
  nombreCompleto?: string;
  numeroDocumento?: string;
  passwordInicial?: string;
  activo: boolean;
  ultimoAcceso?: string;
}

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly endpoint = '/api/v1/cuentas';

  private localCuentas: CuentaUsuarioDTO[] = this.initLocalCuentas();

  private initLocalCuentas(): CuentaUsuarioDTO[] {
    try {
      const stored = sessionStorage.getItem('oasis_cuentas_admin');
      if (stored) return JSON.parse(stored);
    } catch {}
    return SEED_USERS.map((u, i) => ({
      id: i + 1,
      username: u.username,
      rol: u.roles[0] ? `ROLE_${u.roles[0]}` : 'ROLE_RESIDENTE',
      nombreCompleto: u.nombre,
      numeroDocumento: u.username.match(/^\d{8}$/) ? u.username : undefined,
      passwordInicial: u.password || '123456',
      activo: true,
      ultimoAcceso: new Date().toISOString(),
    }));
  }

  private persistLocal(): void {
    try {
      sessionStorage.setItem('oasis_cuentas_admin', JSON.stringify(this.localCuentas));
    } catch {}
  }

  listar(): Observable<CuentaUsuarioDTO[]> {
    return this.http.get<CuentaUsuarioDTO[]>(this.api.buildUrl(this.endpoint)).pipe(
      catchError(() => of(this.localCuentas))
    );
  }

  toggleActivo(id: number): Observable<any> {
    return this.http.patch(this.api.buildUrl(`${this.endpoint}/${id}/toggle-activo`), {}).pipe(
      catchError(() => {
        const item = this.localCuentas.find(c => c.id === id);
        if (item) {
          item.activo = !item.activo;
          this.persistLocal();
        }
        return of(null);
      })
    );
  }

  resetPassword(id: number): Observable<any> {
    return this.http.post<CuentaUsuarioDTO>(this.api.buildUrl(`${this.endpoint}/${id}/reset-password`), {}).pipe(
      catchError(() => {
        const item = this.localCuentas.find(c => c.id === id);
        if (item) {
          item.passwordInicial = '123456';
          this.persistLocal();
        }
        return of({ id, passwordInicial: '123456' });
      })
    );
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): Observable<void> {
    return this.http.post<void>(this.api.buildUrl('/api/v1/auth/cambiar-password'), {
      passwordActual,
      passwordNueva,
    });
  }
}
