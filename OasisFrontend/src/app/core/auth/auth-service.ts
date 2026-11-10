import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { generarCodeChallenge, generarCodeVerifier, generarState } from './pkce';
import { decodeJwtPayload } from './jwt';

export interface SesionKeycloak {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiraEn: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  id_token: string;
  expires_in: number;
}

export interface UserProfile {
  username: string;
  nombre: string;
  email: string;
  roles: string[];
  userId?: string;
}

export interface SeedUserOption {
  username: string;
  nombre: string;
  email: string;
  roleDescription: string;
  roles: string[];
  userId?: string;
  password: string;
}

export const SEED_USERS: SeedUserOption[] = [
  {
    username: 'admin',
    nombre: 'Administrador (José Carlos Mena)',
    email: 'admin@oasis.com',
    roleDescription: 'ADMIN / SUPERVISOR (Acceso Total & Gestión de Cuentas)',
    roles: ['ADMIN', 'SUPERVISOR'],
    password: '123456',
  },
  {
    username: 'supervisor',
    nombre: 'Supervisor de Residencia',
    email: 'supervisor@oasis.com',
    roleDescription: 'SUPERVISOR (Contratos, Reportes y Operaciones)',
    roles: ['SUPERVISOR'],
    password: '123456',
  },
  {
    username: 'recepcion',
    nombre: 'Ana Gómez (Recepcionista)',
    email: 'recepcion@oasis.com',
    roleDescription: 'RECEPCIONISTA (Contratos y Reservas)',
    roles: ['RECEPCIONISTA', 'VENDEDOR'],
    password: '123456',
  },
  {
    username: '74808134',
    nombre: 'José Carlos Mena Sarmiento',
    email: 'jose.mena@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Titular Hab. 101 - DNI 74808134)',
    roles: ['RESIDENTE'],
    userId: '74808134-oasis-user',
    password: '123456',
  },
  {
    username: '71234567',
    nombre: 'Juan Carlos Mena Sarmiento',
    email: 'juan.mena@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 101 - DNI 71234567)',
    roles: ['RESIDENTE'],
    userId: '71234567-oasis-user',
    password: '123456',
  },
  {
    username: '72345678',
    nombre: 'Ronald Alex Solorzano Saya',
    email: 'ronald.solorzano@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 201 - DNI 72345678)',
    roles: ['RESIDENTE'],
    userId: '72345678-oasis-user',
    password: '123456',
  },
  {
    username: '45678901',
    nombre: 'Andrea Ramos Flores',
    email: 'andrea.ramos@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 106 - DNI 45678901)',
    roles: ['RESIDENTE'],
    userId: '45678901-oasis-user',
    password: '123456',
  },
  {
    username: '78901234',
    nombre: 'Sofia Valentina Morales',
    email: 'sofia.morales@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 302 - DNI 78901234)',
    roles: ['RESIDENTE'],
    userId: '78901234-oasis-user',
    password: '123456',
  },
  {
    username: '75123456',
    nombre: 'Mateo Sebastian Torres',
    email: 'mateo.torres@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 103 - DNI 75123456)',
    roles: ['RESIDENTE'],
    userId: '75123456-oasis-user',
    password: '123456',
  },
  {
    username: '76234567',
    nombre: 'Camila Luciana Vega',
    email: 'camila.vega@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 104 - DNI 76234567)',
    roles: ['RESIDENTE'],
    userId: '76234567-oasis-user',
    password: '123456',
  },
  {
    username: '77345678',
    nombre: 'Diego Alonso Chavez',
    email: 'diego.chavez@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 203 - DNI 77345678)',
    roles: ['RESIDENTE'],
    userId: '77345678-oasis-user',
    password: '123456',
  },
  {
    username: '78456789',
    nombre: 'Lucia Fernanda Quispe',
    email: 'lucia.quispe@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 204 - DNI 78456789)',
    roles: ['RESIDENTE'],
    userId: '78456789-oasis-user',
    password: '123456',
  },
  {
    username: '79567890',
    nombre: 'Gabriel Antonio Ruiz',
    email: 'gabriel.ruiz@oasis.edu.pe',
    roleDescription: 'RESIDENTE (Hab. 303 - DNI 79567890)',
    roles: ['RESIDENTE'],
    userId: '79567890-oasis-user',
    password: '123456',
  },
];

const CLAVE_CODE_VERIFIER = 'oasis_pkce_code_verifier';
const CLAVE_STATE = 'oasis_pkce_state';
const CLAVE_DESTINO = 'oasis_pkce_destino';
const CLAVE_SESION = 'oasis_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);

  // Signal privado con la sesión restaurada desde sessionStorage (sobrevive F5)
  private readonly sesion = signal<SesionKeycloak | null>(this.restaurarSesion());

  // Signal reactivo para usuario simulado/seleccionado si Keycloak está en modo local
  private readonly mockUser = signal<UserProfile | null>(this.restaurarMockUser());

  readonly hasRealSession = computed(() => this.sesion() !== null);
  readonly keycloakInaccesible = signal<boolean>(false);
  readonly checkingKeycloak = signal<boolean>(false);

  // Estado reactivo computado
  readonly autenticado = computed(() => {
    const actual = this.sesion();
    if (actual !== null && actual.expiraEn > Date.now()) {
      return true;
    }
    return this.mockUser() !== null;
  });

  readonly roles = computed<string[]>(() => {
    const token = this.sesion()?.accessToken;
    if (token) {
      return decodeJwtPayload(token)?.realm_access?.roles ?? [];
    }
    return this.mockUser()?.roles ?? [];
  });

  readonly usuario = computed(() => {
    const token = this.sesion()?.accessToken;
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        return {
          nombre: payload.name ?? payload.preferred_username ?? 'Usuario Oasis',
          email: payload.email ?? '',
          username: payload.preferred_username ?? 'usuario',
          roles: payload.realm_access?.roles ?? [],
        };
      }
    }
    const mu = this.mockUser();
    if (mu) {
      return {
        nombre: mu.nombre,
        email: mu.email,
        username: mu.username,
        roles: mu.roles,
      };
    }
    return null;
  });

  // Getters y helpers para compatibilidad con componentes existentes
  readonly currentUser = computed(() => this.usuario());
  readonly currentUsername = computed(() => this.usuario()?.username ?? 'admin');
  readonly currentRoles = computed(() => this.roles());
  readonly isAdmin = computed(() => this.tieneRol('ADMIN'));
  readonly isSupervisor = computed(() => this.tieneRol('SUPERVISOR'));
  readonly isResidente = computed(() => this.tieneRol('RESIDENTE'));
  readonly isRecepcionista = computed(() => this.tieneRol('RECEPCIONISTA'));

  tieneRol(...rolesPermitidos: string[]): boolean {
    return rolesPermitidos.some((rol) => this.roles().includes(rol));
  }

  accessToken(): string | null {
    return this.sesion()?.accessToken ?? this.generarMockToken();
  }

  // --- Flujo Authorization Code + PKCE (Keycloak Real) ---
  async iniciarLogin(destino = location.pathname): Promise<boolean> {
    this.keycloakInaccesible.set(false);
    this.checkingKeycloak.set(true);

    // Verificar si Keycloak responde en el puerto 38080 antes de navegar para evitar "No se puede acceder a este sitio"
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      await fetch(`${environment.keycloak.issuer}/protocol/openid-connect/certs`, {
        mode: 'no-cors',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch {
      this.checkingKeycloak.set(false);
      this.keycloakInaccesible.set(true);
      return false;
    }

    this.checkingKeycloak.set(false);
    const verifier = generarCodeVerifier();
    const state = generarState();
    const challenge = await generarCodeChallenge(verifier);

    sessionStorage.setItem(CLAVE_CODE_VERIFIER, verifier);
    sessionStorage.setItem(CLAVE_STATE, state);
    sessionStorage.setItem(CLAVE_DESTINO, destino);

    const parametros = new URLSearchParams({
      client_id: environment.keycloak.clientId,
      response_type: 'code',
      redirect_uri: environment.keycloak.redirectUri,
      scope: 'openid profile email',
      state,
      code_challenge: challenge,
      code_challenge_method: 'S256',
    });

    location.href = `${environment.keycloak.issuer}/protocol/openid-connect/auth?${parametros}`;
    return true;
  }

  async completarLogin(code: string, stateRecibido: string): Promise<void> {
    const stateEsperado = sessionStorage.getItem(CLAVE_STATE);
    const verifier = sessionStorage.getItem(CLAVE_CODE_VERIFIER);
    sessionStorage.removeItem(CLAVE_STATE);

    if (!verifier || stateRecibido !== stateEsperado) {
      throw new Error('state o code_verifier inválido: posible CSRF, inicia el login de nuevo');
    }

    const cuerpo = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: environment.keycloak.clientId,
      redirect_uri: environment.keycloak.redirectUri,
      code,
      code_verifier: verifier,
    });

    const respuesta = await fetch(`${environment.keycloak.issuer}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: cuerpo,
    });

    sessionStorage.removeItem(CLAVE_CODE_VERIFIER);

    if (!respuesta.ok) {
      throw new Error('No se pudo intercambiar el código por un token');
    }

    const data: TokenResponse = await respuesta.json();
    this.guardarSesion(data);
  }

  destinoPendiente(): string {
    const destino = sessionStorage.getItem(CLAVE_DESTINO) ?? '/';
    sessionStorage.removeItem(CLAVE_DESTINO);
    return destino;
  }

  async refrescar(): Promise<boolean> {
    const refreshToken = this.sesion()?.refreshToken;
    if (!refreshToken) return false;

    const cuerpo = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: environment.keycloak.clientId,
      refresh_token: refreshToken,
    });

    try {
      const respuesta = await fetch(`${environment.keycloak.issuer}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: cuerpo,
      });

      if (!respuesta.ok) {
        this.sesion.set(null);
        sessionStorage.removeItem(CLAVE_SESION);
        return false;
      }

      const data: TokenResponse = await respuesta.json();
      this.guardarSesion(data);
      return true;
    } catch {
      return false;
    }
  }

  cerrarSesion(): void {
    const idToken = this.sesion()?.idToken;
    this.sesion.set(null);
    this.mockUser.set(null);
    sessionStorage.removeItem(CLAVE_SESION);
    sessionStorage.removeItem('oasis_mock_user');
    sessionStorage.setItem('oasis_sesion_cerrada', 'true');

    if (idToken) {
      const parametros = new URLSearchParams({
        id_token_hint: idToken,
        post_logout_redirect_uri: environment.keycloak.postLogoutRedirectUri,
      });
      location.href = `${environment.keycloak.issuer}/protocol/openid-connect/logout?${parametros}`;
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  // --- Métodos de apoyo y persistencia en sessionStorage ---
  private guardarSesion(data: TokenResponse): void {
    sessionStorage.removeItem('oasis_sesion_cerrada');
    const sesion: SesionKeycloak = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      idToken: data.id_token,
      expiraEn: Date.now() + (data.expires_in - 30) * 1000,
    };
    this.sesion.set(sesion);
    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  }

  private restaurarSesion(): SesionKeycloak | null {
    try {
      if (sessionStorage.getItem('oasis_sesion_cerrada') === 'true') {
        return null;
      }
      const guardada = sessionStorage.getItem(CLAVE_SESION);
      if (!guardada) return null;
      const parsed: SesionKeycloak = JSON.parse(guardada);
      if (parsed.expiraEn > Date.now()) {
        return parsed;
      }
      sessionStorage.removeItem(CLAVE_SESION);
      return null;
    } catch {
      return null;
    }
  }

  private restaurarMockUser(): UserProfile | null {
    try {
      if (sessionStorage.getItem('oasis_sesion_cerrada') === 'true') {
        return null;
      }
      const u = sessionStorage.getItem('oasis_mock_user');
      return u ? JSON.parse(u) : SEED_USERS[0];
    } catch {
      return SEED_USERS[0];
    }
  }

  // Permite simular o cambiar entre los roles de prueba con 1 clic en la cabecera
  loginWithSeedUser(username: string): void {
    sessionStorage.removeItem('oasis_sesion_cerrada');
    const seed = SEED_USERS.find((u) => u.username === username);
    if (seed) {
      const profile: UserProfile = {
        username: seed.username,
        nombre: seed.nombre,
        email: seed.email,
        roles: seed.roles,
        userId: seed.userId,
      };
      this.mockUser.set(profile);
      sessionStorage.setItem('oasis_mock_user', JSON.stringify(profile));
    }
  }

  private generarMockToken(): string | null {
    const user = this.usuario();
    if (!user) return null;
    // Estructura JWT simulada para modo offline / desarrollo (formato Base64URL sin relleno '=' y con UTF-8 seguro)
    const toBase64Url = (str: string) => {
      try {
        const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
          String.fromCharCode(parseInt(p1, 16))
        );
        return btoa(utf8Bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } catch {
        return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      }
    };

    const header = toBase64Url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
    const payload = toBase64Url(
      JSON.stringify({
        sub: user.username,
        preferred_username: user.username,
        name: user.nombre,
        email: user.email,
        realm_access: { roles: user.roles },
        exp: Math.floor(Date.now() / 1000) + 86400,
      })
    );
    return `${header}.${payload}.signature`;
  }
}
