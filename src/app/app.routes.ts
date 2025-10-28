import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { redirectGuard } from './core/guards/redirect.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  {
    path: '',
    loadChildren: () => import('./core/layout/layout.routes').then(m => m.LAYOUT_ROUTES)
  },

  {
    path: '**',
    canActivate: [redirectGuard],
    children: []
  }
];
