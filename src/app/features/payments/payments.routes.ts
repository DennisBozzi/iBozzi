import { Routes } from '@angular/router';

export const PAYMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/payments-list/payments-list.component').then(m => m.PaymentsListComponent),
    title: 'Pagamentos - iBozzi',
    data: {
      showHeader: true,
      headerTitle: 'layout.payments'
    },
  }
];
