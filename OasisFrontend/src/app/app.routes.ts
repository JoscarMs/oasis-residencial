import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { rolGuard } from './core/guards/rol-guard';

export const routes: Routes = [
  // Ruta pública de retorno de Keycloak (Authorization Code + PKCE)
  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./core/auth/auth-callback').then((m) => m.AuthCallback),
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/inicio/inicio').then((m) => m.Inicio),
      },
      // Pantalla de acceso denegado (403)
      {
        path: 'sin-permiso',
        loadComponent: () =>
          import('./core/sin-permiso/sin-permiso').then((m) => m.SinPermiso),
      },
      // Alojamientos: Tipos de Habitación
      {
        path: 'alojamiento/tipos-habitacion',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/alojamiento/tipo-habitacion/tipo-habitacion-list').then(
            (m) => m.TipoHabitacionList
          ),
      },
      {
        path: 'alojamiento/tipos-habitacion/nuevo',
        canActivate: [authGuard, rolGuard('ADMIN', 'SUPERVISOR')],
        loadComponent: () =>
          import('./features/alojamiento/tipo-habitacion/tipo-habitacion-form').then(
            (m) => m.TipoHabitacionForm
          ),
      },
      {
        path: 'alojamiento/tipos-habitacion/:id/editar',
        canActivate: [authGuard, rolGuard('ADMIN', 'SUPERVISOR')],
        loadComponent: () =>
          import('./features/alojamiento/tipo-habitacion/tipo-habitacion-form').then(
            (m) => m.TipoHabitacionForm
          ),
      },
      // Alojamientos: Habitaciones (Inventario)
      {
        path: 'alojamiento/habitaciones',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/alojamiento/habitacion/habitacion-list').then(
            (m) => m.HabitacionList
          ),
      },
      {
        path: 'alojamiento/habitaciones/nueva',
        canActivate: [authGuard, rolGuard('ADMIN', 'SUPERVISOR')],
        loadComponent: () =>
          import('./features/alojamiento/habitacion/habitacion-form').then(
            (m) => m.HabitacionForm
          ),
      },
      {
        path: 'alojamiento/habitaciones/:id/editar',
        canActivate: [authGuard, rolGuard('ADMIN', 'SUPERVISOR')],
        loadComponent: () =>
          import('./features/alojamiento/habitacion/habitacion-form').then(
            (m) => m.HabitacionForm
          ),
      },
      // Residentes / Huéspedes
      {
        path: 'residentes',
        canActivate: [authGuard, rolGuard('ADMIN', 'SUPERVISOR', 'RECEPCIONISTA', 'VENDEDOR')],
        loadComponent: () =>
          import('./features/residentes/huesped-list').then((m) => m.HuespedList),
      },
      // Contratos de Residencia
      {
        path: 'contratos/nuevo',
        canActivate: [authGuard, rolGuard('ADMIN', 'SUPERVISOR', 'RECEPCIONISTA', 'VENDEDOR')],
        loadComponent: () =>
          import('./features/contratos/contrato-form').then(
            (m) => m.ContratoForm
          ),
      },
      {
        path: 'contratos/reporte',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/contratos/contrato-reporte').then(
            (m) => m.ContratoReporte
          ),
      },
      {
        path: 'contratos/conceptos',
        canActivate: [authGuard, rolGuard('ADMIN', 'SUPERVISOR')],
        loadComponent: () =>
          import('./features/contratos/conceptos/concepto-contrato-list').then(
            (m) => m.ConceptoContratoList
          ),
      },
      // Servicios Extras & Tienda Residencia
      {
        path: 'servicios',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/servicios/servicio-list').then(
            (m) => m.ServicioList
          ),
      },
      // Pagos & Finanzas (ABAC)
      {
        path: 'pagos',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/pagos/pago-list').then((m) => m.PagoList),
      },
      // Portal Residente: Mi Habitación
      {
        path: 'mi-habitacion',
        canActivate: [authGuard, rolGuard('RESIDENTE', 'ADMIN')],
        loadComponent: () =>
          import('./features/mi-habitacion/mi-habitacion').then(
            (m) => m.MiHabitacion
          ),
      },
      // Mantenimiento / Averías
      {
        path: 'mantenimiento',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/mantenimiento/mantenimiento-list').then(
            (m) => m.MantenimientoList
          ),
      },
      // Avisos Comunitarios
      {
        path: 'comunicacion/avisos',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/comunicacion/aviso/aviso-list').then((m) => m.AvisoList),
      },
      // Seguridad: Cuentas y Credenciales (Exclusivo ADMIN)
      {
        path: 'seguridad/cuentas',
        canActivate: [authGuard, rolGuard('ADMIN')],
        loadComponent: () =>
          import('./features/seguridad/cuenta-list').then((m) => m.CuentaList),
      },
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    ],
  },
];
