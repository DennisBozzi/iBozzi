import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { authGuard } from '../guards/auth.guard';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadChildren: () => import('../../features/home/home.routes').then(m => m.HOME_ROUTES)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../../features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: 'tenants',
        loadChildren: () => import('../../features/tenants/tenants.routes').then(m => m.TENANTS_ROUTES)
      },
      {
        path: 'units',
        loadChildren: () => import('../../features/units/units.routes').then(m => m.UNITS_ROUTES)
      },
      {
        path: 'payments',
        loadChildren: () => import('../../features/payments/payments.routes').then(m => m.PAYMENTS_ROUTES)
      },
      {
        path: 'profile',
        loadChildren: () => import('../../features/profile/profile.routes').then(m => m.PROFILE_ROUTES)
      }
    ]
  }
];
