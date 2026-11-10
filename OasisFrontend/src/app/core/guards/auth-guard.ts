import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.autenticado()) {
    return true;
  }

  // Redirigir a inicio amigablemente si no está autenticado sin romper la navegación offline
  router.navigate(['/inicio'], { queryParams: { returnUrl: state.url, authRequired: 'true' } });
  return false;
};
