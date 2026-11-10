import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // No adjuntar token si la petición es al endpoint de token de Keycloak
  if (req.url.includes('/protocol/openid-connect/token')) {
    return next(req);
  }

  const conToken = (token: string | null) =>
    token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(conToken(auth.accessToken())).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo intentar refrescar si existe una sesión real con refreshToken de Keycloak
      if (error.status === 401 && auth.hasRealSession()) {
        return from(auth.refrescar()).pipe(
          switchMap((renovado) => {
            if (!renovado) {
              return throwError(() => error);
            }
            return next(conToken(auth.accessToken()));
          })
        );
      }
      return throwError(() => error);
    })
  );
};
