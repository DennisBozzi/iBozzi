import { Routes } from '@angular/router';

export const TENANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tenants-list/tenants-list.component').then(m => m.TenantsListComponent),
    title: 'Inquilinos - iBozzi'
  }
];
