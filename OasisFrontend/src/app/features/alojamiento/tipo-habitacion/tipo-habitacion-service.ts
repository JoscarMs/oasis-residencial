import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api-service';
import { TipoHabitacion } from './tipo-habitacion.model';

@Injectable({ providedIn: 'root' })
export class TipoHabitacionService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/tipos-habitacion';

  listar(): Observable<TipoHabitacion[]> {
    return this.http.get<TipoHabitacion[]>(this.api.buildUrl(this.resource));
  }

  obtener(id: number): Observable<TipoHabitacion> {
    return this.http.get<TipoHabitacion>(this.api.buildUrl(`${this.resource}/${id}`));
  }

  crear(tipoHabitacion: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.post<TipoHabitacion>(this.api.buildUrl(this.resource), tipoHabitacion);
  }

  actualizar(id: number, tipoHabitacion: TipoHabitacion): Observable<TipoHabitacion> {
    return this.http.put<TipoHabitacion>(this.api.buildUrl(`${this.resource}/${id}`), tipoHabitacion);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.api.buildUrl(`${this.resource}/${id}`));
  }
}