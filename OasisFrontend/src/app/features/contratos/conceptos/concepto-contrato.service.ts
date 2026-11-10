import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api-service';
import { ConceptoContrato } from './concepto-contrato.model';
import { SEED_CONCEPTOS_CONTRATO } from './concepto-contrato-seed';

@Injectable({ providedIn: 'root' })
export class ConceptoContratoService {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  private readonly endpoint = '/api/v1/conceptos-contrato';

  private localConceptos: ConceptoContrato[] = this.restaurarConceptosLocales();

  private restaurarConceptosLocales(): ConceptoContrato[] {
    try {
      const stored = sessionStorage.getItem('oasis_conceptos_seed');
      if (stored) return JSON.parse(stored);
    } catch {}
    return JSON.parse(JSON.stringify(SEED_CONCEPTOS_CONTRATO));
  }

  private guardarConceptosLocales(): void {
    try {
      sessionStorage.setItem('oasis_conceptos_seed', JSON.stringify(this.localConceptos));
    } catch {}
  }

  listarActivos(): Observable<ConceptoContrato[]> {
    return this.http.get<ConceptoContrato[]>(this.api.buildUrl(this.endpoint)).pipe(
      catchError(() => of(this.localConceptos.filter(c => c.activo)))
    );
  }

  listarTodos(): Observable<ConceptoContrato[]> {
    return this.http.get<ConceptoContrato[]>(this.api.buildUrl(`${this.endpoint}/todos`)).pipe(
      catchError(() => of(this.localConceptos))
    );
  }

  crear(concepto: ConceptoContrato): Observable<ConceptoContrato> {
    return this.http.post<ConceptoContrato>(this.api.buildUrl(this.endpoint), concepto).pipe(
      catchError(() => {
        const nuevo: ConceptoContrato = {
          ...concepto,
          id: this.localConceptos.length + 1,
        };
        this.localConceptos.push(nuevo);
        this.guardarConceptosLocales();
        return of(nuevo);
      })
    );
  }

  actualizar(id: number, concepto: ConceptoContrato): Observable<ConceptoContrato> {
    return this.http.put<ConceptoContrato>(this.api.buildUrl(`${this.endpoint}/${id}`), concepto).pipe(
      catchError(() => {
        const idx = this.localConceptos.findIndex(c => c.id === id);
        if (idx !== -1) {
          this.localConceptos[idx] = { ...concepto, id };
          this.guardarConceptosLocales();
          return of(this.localConceptos[idx]);
        }
        return of(this.localConceptos[0]);
      })
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.api.buildUrl(`${this.endpoint}/${id}`)).pipe(
      catchError(() => {
        this.localConceptos = this.localConceptos.filter(c => c.id !== id);
        this.guardarConceptosLocales();
        return of(undefined as void);
      })
    );
  }
}
