import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api-service';
import { ServicioExtra, CompraServicio } from './servicio-extra.model';

@Injectable({ providedIn: 'root' })
export class ServicioExtraService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly baseUrlServicios = '/api/v1/servicios-extras';
  private readonly baseUrlCompras = '/api/v1/compras-servicios';

  // --- CRUD Catálogo de Servicios Extras ---
  listarActivos(): Observable<ServicioExtra[]> {
    return this.http.get<ServicioExtra[]>(this.api.buildUrl(this.baseUrlServicios));
  }

  listarTodos(): Observable<ServicioExtra[]> {
    return this.http.get<ServicioExtra[]>(this.api.buildUrl(`${this.baseUrlServicios}/todos`));
  }

  obtenerPorId(id: number): Observable<ServicioExtra> {
    return this.http.get<ServicioExtra>(this.api.buildUrl(`${this.baseUrlServicios}/${id}`));
  }

  crear(servicio: ServicioExtra): Observable<ServicioExtra> {
    return this.http.post<ServicioExtra>(this.api.buildUrl(this.baseUrlServicios), servicio);
  }

  actualizar(id: number, servicio: ServicioExtra): Observable<ServicioExtra> {
    return this.http.put<ServicioExtra>(this.api.buildUrl(`${this.baseUrlServicios}/${id}`), servicio);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.api.buildUrl(`${this.baseUrlServicios}/${id}`));
  }

  // --- Solicitudes y Compras de Servicios (ABAC) ---
  listarCompras(): Observable<CompraServicio[]> {
    return this.http.get<CompraServicio[]>(this.api.buildUrl(this.baseUrlCompras));
  }

  solicitarServicio(compra: CompraServicio): Observable<CompraServicio> {
    return this.http.post<CompraServicio>(this.api.buildUrl(this.baseUrlCompras), compra);
  }

  actualizarEstado(id: number, estado: string): Observable<CompraServicio> {
    const params = new HttpParams().set('estado', estado);
    return this.http.patch<CompraServicio>(this.api.buildUrl(`${this.baseUrlCompras}/${id}/estado`), null, { params });
  }
}
