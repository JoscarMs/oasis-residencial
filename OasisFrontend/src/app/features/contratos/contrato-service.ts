import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../core/services/api-service';
import { Contrato, ContratoRequest } from './contrato.model';
import { SEED_CONTRATOS } from './contrato-seed';
import { SEED_HUESPEDES } from '../residentes/huesped-seed';
import { SEED_HABITACIONES } from '../alojamiento/habitacion/habitacion-seed';

@Injectable({ providedIn: 'root' })
export class ContratoService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/contratos';

  // Signal para indicar si se está usando el modo local / mock de contratos
  readonly isModoLocal = signal<boolean>(false);

  // Almacén reactivo en memoria para contratos locales
  private localContratos: Contrato[] = this.restaurarContratosLocales();

  private restaurarContratosLocales(): Contrato[] {
    try {
      const stored = sessionStorage.getItem('oasis_contratos_seed');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return JSON.parse(JSON.stringify(SEED_CONTRATOS));
  }

  private guardarContratosLocales(): void {
    try {
      sessionStorage.setItem('oasis_contratos_seed', JSON.stringify(this.localContratos));
    } catch {}
  }

  listar(estado?: string, desde?: string, hasta?: string): Observable<Contrato[]> {
    let params = new HttpParams();
    if (estado && estado !== 'TODOS') {
      params = params.set('estado', estado);
    }
    if (desde) {
      params = params.set('desde', desde);
    }
    if (hasta) {
      params = params.set('hasta', hasta);
    }

    return this.http.get<Contrato[]>(this.api.buildUrl(this.resource), { params }).pipe(
      tap(() => {
        this.isModoLocal.set(false);
      }),
      catchError((err) => {
        console.warn('[ContratoService] Backend offline o no responde en http://localhost:8080/api/v1/contratos. Activando datos semilla locales.', err);
        this.isModoLocal.set(true);

        let filtrados = [...this.localContratos];
        if (estado && estado !== 'TODOS') {
          filtrados = filtrados.filter((c) => c.estado === estado);
        }
        if (desde) {
          filtrados = filtrados.filter((c) => c.fechaInicio >= desde);
        }
        if (hasta) {
          filtrados = filtrados.filter((c) => c.fechaInicio <= hasta);
        }
        return of(filtrados);
      })
    );
  }

  obtener(id: number): Observable<Contrato> {
    return this.http.get<Contrato>(this.api.buildUrl(`${this.resource}/${id}`)).pipe(
      catchError(() => {
        const c = this.localContratos.find((item) => item.id === id);
        return c ? of(c) : of(this.localContratos[0]);
      })
    );
  }

  formalizar(request: ContratoRequest): Observable<Contrato> {
    return this.http.post<Contrato>(this.api.buildUrl(this.resource), request).pipe(
      catchError(() => {
        const nuevoId = this.localContratos.length + 1;
        const codigo = `CTR-2026-${String(nuevoId).padStart(4, '0')}`;
        const huesped = SEED_HUESPEDES.find(h => h.id === request.huespedId);
        const habitacion = SEED_HABITACIONES.find(h => h.id === request.habitacionId);

        const nuevoContrato: Contrato = {
          id: nuevoId,
          codigoContrato: codigo,
          huespedId: request.huespedId,
          huespedNombre: huesped ? huesped.nombreCompleto : 'Huésped Registrado #' + request.huespedId,
          huespedDni: huesped ? huesped.numeroDocumento : undefined,
          habitacionId: request.habitacionId,
          habitacionNumero: habitacion ? habitacion.numero : '10' + (nuevoId % 10),
          habitacionTipo: habitacion ? (habitacion.tipoHabitacionNombre || 'Habitación') : 'Habitación Asignada',
          habitacionPrecio: habitacion ? habitacion.precio : 350,
          tipoContratoId: request.tipoContratoId,
          tipoContratoNombre: request.tipoContratoId === 1 ? 'Contrato Semestral (6 meses)' : request.tipoContratoId === 3 ? 'Contrato Multianual (24 meses)' : 'Contrato Anual (12 meses)',
          fechaInicio: request.fechaInicio || new Date().toISOString().split('T')[0],
          fechaFin: request.fechaFin || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
          totalContrato: request.detalles.reduce((acc, d) => acc + d.cantidad * d.precioUnitario, 0),
          estado: 'VIGENTE',
          detalles: request.detalles.map((d, idx) => ({
            id: idx + 1,
            concepto: d.concepto,
            cantidad: d.cantidad,
            precioUnitario: d.precioUnitario,
            subtotal: d.cantidad * d.precioUnitario,
          })),
        };
        this.localContratos.unshift(nuevoContrato);
        this.guardarContratosLocales();
        return of(nuevoContrato);
      })
    );
  }

  anular(id: number): Observable<void> {
    return this.http.patch<void>(this.api.buildUrl(`${this.resource}/${id}/anular`), {}).pipe(
      catchError(() => {
        const idx = this.localContratos.findIndex((c) => c.id === id);
        if (idx !== -1) {
          this.localContratos[idx].estado = 'ANULADO';
          this.guardarContratosLocales();
        }
        return of(undefined as void);
      })
    );
  }
}
