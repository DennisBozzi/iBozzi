import { BreadcrumbItem } from '@/shared/interfaces';
import { Routes } from '@angular/router';

export const TENANTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tenants-list/tenants-list.component').then(m => m.TenantsListComponent),
    title: 'Inquilinos - iBozzi',
    data: {
      showHeader: true,
      headerTitle: 'layout.tenants'
    },
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/new-tenant/new-tenant.component').then(m => m.NewTenantComponent),
    title: 'New Tenant - iBozzi',
    data: {
      showHeader: true,
      isRegister: true,
      breadCrumb: [
        { label: 'layout.tenants', url: '/tenants' },
        { label: 'layout.register', url: '/tenants/new' }
      ] as BreadcrumbItem[],
    },
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/tenant/tenant.component').then(m => m.TenantComponent),
    title: 'Tenant - iBozzi',
  },
];
