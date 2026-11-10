import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api-service';
import { Aviso } from './aviso.model';

@Injectable({ providedIn: 'root' })
export class AvisoService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly resource = '/api/v1/actividades';

  listar(): Observable<Aviso[]> {
    return this.http.get<Aviso[]>(this.api.buildUrl(this.resource));
  }

  obtener(id: number): Observable<Aviso> {
    return this.http.get<Aviso>(this.api.buildUrl(`${this.resource}/${id}`));
  }

  crear(aviso: Partial<Aviso>): Observable<Aviso> {
    return this.http.post<Aviso>(this.api.buildUrl(this.resource), aviso);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.api.buildUrl(`${this.resource}/${id}`));
  }
}