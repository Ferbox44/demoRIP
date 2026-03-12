import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/layout').then(m => m.LayoutComponent),
    children: [
      { path: 'dashboard',       loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'inventario',      loadComponent: () => import('./features/inventario/inventario').then(m => m.InventarioComponent) },
      { path: 'entradas',        loadComponent: () => import('./features/entradas/nueva-entrada').then(m => m.NuevaEntradaComponent) },
      { path: 'salidas',         loadComponent: () => import('./features/salidas/salidas').then(m => m.SalidasComponent) },
      { path: 'equipos',         loadComponent: () => import('./features/equipos/equipos-velacion').then(m => m.EquiposVelacionComponent) },
      { path: 'devoluciones',    loadComponent: () => import('./features/devoluciones/devoluciones').then(m => m.DevolucionesComponent) },
      { path: 'trazabilidad/:id', loadComponent: () => import('./features/trazabilidad/trazabilidad').then(m => m.TrazabilidadComponent) },
      { path: 'reportes',        loadComponent: () => import('./features/reportes/reportes').then(m => m.ReportesComponent) },
      { path: 'alertas',         loadComponent: () => import('./features/alertas/alertas').then(m => m.AlertasComponent) },
      { path: 'configuracion',   loadComponent: () => import('./features/configuracion/configuracion').then(m => m.ConfiguracionComponent) },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
