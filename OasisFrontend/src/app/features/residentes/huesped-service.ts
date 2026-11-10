import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api-service';
import { Huesped, HuespedRequest } from './huesped.model';
import { SEED_HUESPEDES } from './huesped-seed';

export interface IdentidadReniec {
  tipoDocumento: string;
  numeroDocumento: string;
  nombreCompleto: string;
  nombres?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  direccion?: string;
  estado?: string;
}

@Injectable({ providedIn: 'root' })
export class HuespedService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/residentes';

  private localHuespedes: Huesped[] = this.restaurarHuespedesLocales();

  private restaurarHuespedesLocales(): Huesped[] {
    try {
      const stored = sessionStorage.getItem('oasis_huespedes_seed');
      if (stored) return JSON.parse(stored);
    } catch {}
    return JSON.parse(JSON.stringify(SEED_HUESPEDES));
  }

  private guardarHuespedesLocales(): void {
    try {
      sessionStorage.setItem('oasis_huespedes_seed', JSON.stringify(this.localHuespedes));
    } catch {}
  }

  listar(): Observable<Huesped[]> {
    return this.http.get<Huesped[]>(this.api.buildUrl(this.resource)).pipe(
      catchError(() => of(this.localHuespedes))
    );
  }

  consultarIdentidad(tipo: string, numero: string): Observable<IdentidadReniec> {
    const ruta = tipo === 'RUC' ? 'ruc' : 'dni';
    return this.http.get<IdentidadReniec>(this.api.buildUrl(`/api/v1/identidad/${ruta}/${numero}`)).pipe(
      catchError((err) => {
        // Si el backend no responde, buscar si coincide con algún residente ya en memoria
        const coincidencia = this.localHuespedes.find((h) => h.numeroDocumento === numero);
        if (coincidencia) {
          return of({
            tipoDocumento: tipo,
            numeroDocumento: numero,
            nombreCompleto: coincidencia.nombreCompleto,
          });
        }
        throw err;
      })
    );
  }

  obtener(id: number): Observable<Huesped> {
    return this.http.get<Huesped>(this.api.buildUrl(`${this.resource}/${id}`)).pipe(
      catchError(() => {
        const h = this.localHuespedes.find((item) => item.id === id);
        return of(h || this.localHuespedes[0]);
      })
    );
  }

  crear(request: HuespedRequest): Observable<Huesped> {
    return this.http.post<Huesped>(this.api.buildUrl(this.resource), request).pipe(
      catchError(() => {
        const nuevoId = this.localHuespedes.length + 1;
        const nuevo: Huesped = {
          id: nuevoId,
          nombreCompleto: request.nombreCompleto || `Residente ${request.numeroDocumento}`,
          email: request.email || `${request.numeroDocumento}@oasis.pe`,
          telefono: request.telefono || '',
          tipoDocumento: request.tipoDocumento || 'DNI',
          numeroDocumento: request.numeroDocumento,
          perfil: request.perfil || 'ESTUDIANTE',
          esMenorDeEdad: !!request.esMenorDeEdad,
          nombreApoderado: request.nombreApoderado,
          telefonoApoderado: request.telefonoApoderado,
          dniApoderado: request.dniApoderado,
          parentesco: request.parentesco,
        };
        this.localHuespedes.unshift(nuevo);
        this.guardarHuespedesLocales();

        // Autogenerar cuenta de usuario residente en sesión local
        try {
          const raw = sessionStorage.getItem('oasis_cuentas_admin');
          const cuentas = raw ? JSON.parse(raw) : [];
          if (!cuentas.some((c: any) => c.username === request.numeroDocumento)) {
            cuentas.push({
              id: Date.now(),
              username: request.numeroDocumento,
              rol: 'ROLE_RESIDENTE',
              nombreCompleto: nuevo.nombreCompleto,
              numeroDocumento: nuevo.numeroDocumento,
              passwordInicial: '123456',
              activo: true,
              ultimoAcceso: new Date().toISOString(),
            });
            sessionStorage.setItem('oasis_cuentas_admin', JSON.stringify(cuentas));
          }
        } catch {}

        return of(nuevo);
      })
    );
  }

  actualizar(id: number, request: HuespedRequest): Observable<Huesped> {
    return this.http.put<Huesped>(this.api.buildUrl(`${this.resource}/${id}`), request).pipe(
      catchError(() => {
        const idx = this.localHuespedes.findIndex((h) => h.id === id);
        if (idx !== -1) {
          this.localHuespedes[idx] = {
            ...this.localHuespedes[idx],
            ...request,
            id,
            nombreCompleto: request.nombreCompleto || this.localHuespedes[idx].nombreCompleto,
            email: request.email || this.localHuespedes[idx].email,
          };
          this.guardarHuespedesLocales();
          return of(this.localHuespedes[idx]);
        }
        return of(this.localHuespedes[0]);
      })
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.api.buildUrl(`${this.resource}/${id}`)).pipe(
      catchError(() => {
        this.localHuespedes = this.localHuespedes.filter((h) => h.id !== id);
        this.guardarHuespedesLocales();
        return of(undefined as void);
      })
    );
  }
}
