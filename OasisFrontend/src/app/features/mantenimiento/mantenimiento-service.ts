import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api-service';
import { ReporteMantenimiento, ReporteMantenimientoRequest } from './mantenimiento.model';

@Injectable({ providedIn: 'root' })
export class MantenimientoService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/reportes';

  listarTodos(): Observable<ReporteMantenimiento[]> {
    return this.http.get<ReporteMantenimiento[]>(this.api.buildUrl(this.resource));
  }

  listarPorHuesped(huespedId: number): Observable<ReporteMantenimiento[]> {
    return this.http.get<ReporteMantenimiento[]>(this.api.buildUrl(`${this.resource}/huesped/${huespedId}`));
  }

  obtener(id: number): Observable<ReporteMantenimiento> {
    return this.http.get<ReporteMantenimiento>(this.api.buildUrl(`${this.resource}/${id}`));
  }

  crear(request: ReporteMantenimientoRequest): Observable<ReporteMantenimiento> {
    return this.http.post<ReporteMantenimiento>(this.api.buildUrl(this.resource), request);
  }

  actualizarEstado(id: number, estado: string): Observable<ReporteMantenimiento> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<ReporteMantenimiento>(this.api.buildUrl(`${this.resource}/${id}/estado`), null, { params });
  }
}
