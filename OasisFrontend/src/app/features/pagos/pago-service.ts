import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api-service';
import { Pago, PagoRequest, ReporteIngresos } from './pago.model';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/pagos';

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.api.buildUrl(this.resource));
  }

  obtener(id: number): Observable<Pago> {
    return this.http.get<Pago>(this.api.buildUrl(`${this.resource}/${id}`));
  }

  crear(request: PagoRequest): Observable<Pago> {
    return this.http.post<Pago>(this.api.buildUrl(this.resource), request);
  }

  reporteMensual(anio: number, mes: number): Observable<ReporteIngresos> {
    const params = new HttpParams().set('anio', anio).set('mes', mes);
    return this.http.get<ReporteIngresos>(this.api.buildUrl(`${this.resource}/reportes/mensual`), { params });
  }

  reporteAnual(anio: number): Observable<ReporteIngresos> {
    const params = new HttpParams().set('anio', anio);
    return this.http.get<ReporteIngresos>(this.api.buildUrl(`${this.resource}/reportes/anual`), { params });
  }
}
