import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api-service';
import { Habitacion, HabitacionRequest } from './habitacion.model';
import { SEED_HABITACIONES } from './habitacion-seed';

@Injectable({ providedIn: 'root' })
export class HabitacionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/habitaciones';

  private localHabitaciones: Habitacion[] = this.restaurarHabitacionesLocales();

  private restaurarHabitacionesLocales(): Habitacion[] {
    try {
      const stored = sessionStorage.getItem('oasis_habitaciones_seed');
      if (stored) return JSON.parse(stored);
    } catch {}
    return JSON.parse(JSON.stringify(SEED_HABITACIONES));
  }

  private guardarHabitacionesLocales(): void {
    try {
      sessionStorage.setItem('oasis_habitaciones_seed', JSON.stringify(this.localHabitaciones));
    } catch {}
  }

  listar(tipoHabitacionId?: number): Observable<Habitacion[]> {
    let params = new HttpParams();
    if (tipoHabitacionId && tipoHabitacionId > 0) {
      params = params.set('tipoHabitacionId', tipoHabitacionId.toString());
    }
    return this.http.get<Habitacion[]>(this.api.buildUrl(this.resource), { params }).pipe(
      catchError(() => {
        let filtradas = [...this.localHabitaciones];
        if (tipoHabitacionId && tipoHabitacionId > 0) {
          filtradas = filtradas.filter(h => h.tipoHabitacionId === tipoHabitacionId);
        }
        return of(filtradas);
      })
    );
  }

  obtener(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(this.api.buildUrl(`${this.resource}/${id}`)).pipe(
      catchError(() => {
        const h = this.localHabitaciones.find(item => item.id === id);
        return of(h || this.localHabitaciones[0]);
      })
    );
  }

  crear(habitacion: HabitacionRequest): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.api.buildUrl(this.resource), habitacion).pipe(
      catchError(() => {
        const nuevoId = this.localHabitaciones.length + 1;
        const nueva: Habitacion = {
          id: nuevoId,
          numero: habitacion.numero,
          piso: habitacion.piso,
          precio: habitacion.precio,
          estado: habitacion.estado || 'DISPONIBLE',
          tipoHabitacionId: habitacion.tipoHabitacionId,
          tipoHabitacionNombre: habitacion.tipoHabitacionId === 1 ? 'Habitación Normal' : habitacion.tipoHabitacionId === 2 ? 'Minidepartamento' : 'Departamento',
          amoblada: habitacion.amoblada,
          tipoBano: habitacion.tipoBano,
        };
        this.localHabitaciones.push(nueva);
        this.guardarHabitacionesLocales();
        return of(nueva);
      })
    );
  }

  actualizar(id: number, habitacion: HabitacionRequest): Observable<Habitacion> {
    return this.http.put<Habitacion>(this.api.buildUrl(`${this.resource}/${id}`), habitacion).pipe(
      catchError(() => {
        const idx = this.localHabitaciones.findIndex(h => h.id === id);
        if (idx !== -1) {
          this.localHabitaciones[idx] = {
            ...this.localHabitaciones[idx],
            numero: habitacion.numero,
            piso: habitacion.piso,
            precio: habitacion.precio,
            estado: habitacion.estado,
            tipoHabitacionId: habitacion.tipoHabitacionId,
            amoblada: habitacion.amoblada,
            tipoBano: habitacion.tipoBano,
          };
          this.guardarHabitacionesLocales();
          return of(this.localHabitaciones[idx]);
        }
        return of(this.localHabitaciones[0]);
      })
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.api.buildUrl(`${this.resource}/${id}`)).pipe(
      catchError(() => {
        this.localHabitaciones = this.localHabitaciones.filter(h => h.id !== id);
        this.guardarHabitacionesLocales();
        return of(undefined as void);
      })
    );
  }
}
