import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./cliente/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'admin-local',
    loadComponent: () =>
      import('./admin/admin-local/admin-local.component').then(m => m.AdminLocalDashboardComponent)
  }
];