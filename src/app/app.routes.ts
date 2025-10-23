import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { redirectGuard } from './core/guards/redirect.guard';

export const routes: Routes = [
  // Redireciona raiz para login
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },

  // Rotas de autenticação (sem layout)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // Rotas protegidas com layout
  {
    path: '',
    loadChildren: () => import('./core/layout/layout.routes').then(m => m.LAYOUT_ROUTES)
  },

  // Rota 404 - catch all
  {
    path: '**',
    canActivate: [redirectGuard],
    children: []
  }
];
