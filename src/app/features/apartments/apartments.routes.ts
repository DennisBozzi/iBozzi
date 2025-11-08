import { Routes } from '@angular/router';

export const APARTMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/apartments-list/apartments-list.component').then(m => m.ApartmentsListComponent),
    title: 'Apartamentos - iBozzi',
    data: {
      showHeader: true,
      headerTitle: 'layout.apartments'
    },
  }
];
