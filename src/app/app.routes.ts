import { Routes } from '@angular/router';
import { rolGuard } from './core/guards/rol.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./cliente/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin-local',
    loadComponent: () =>
      import('./admin/admin-local/admin-local.component').then(m => m.AdminLocalDashboardComponent),
    canActivate: [rolGuard(['admin_local'])]
  },

  {
  path: 'tienda/:id',
  loadComponent: () =>
    import('./cliente/home/tienda-detalle.component').then(m => m.TiendaDetalleComponent)
  }

];