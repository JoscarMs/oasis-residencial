import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth-service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  template: `
    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:60vh; font-family:'Outfit','Inter',sans-serif;">
      <div style="width:40px; height:40px; border:4px solid #fdf8ee; border-top-color:#d1a153; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
      <h3 style="margin-top:1.5rem; color:#1a252f;">Completando inicio de sesión con Keycloak...</h3>
      <p style="color:#64748b; font-size:0.85rem;">Autenticando contra el Realm OASIS y verificando credenciales seguras (PKCE)...</p>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    </div>
  `,
})
export class AuthCallback {
  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);
    const auth = inject(AuthService);

    const codigo = route.snapshot.queryParamMap.get('code');
    const state = route.snapshot.queryParamMap.get('state');
    const error = route.snapshot.queryParamMap.get('error');

    if (error || !codigo || !state) {
      router.navigateByUrl('/');
      return;
    }

    auth
      .completarLogin(codigo, state)
      .then(() => router.navigateByUrl(auth.destinoPendiente()))
      .catch((err) => {
        console.error('Error completando login PKCE:', err);
        router.navigateByUrl('/');
      });
  }
}
