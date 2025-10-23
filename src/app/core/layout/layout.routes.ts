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
        path: 'tenants',
        loadChildren: () => import('../../features/tenants/tenants.routes').then(m => m.TENANTS_ROUTES)
      }
    ]
  }
];
