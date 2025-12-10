import { Routes } from '@angular/router';

export const UNITS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/units-list/units-list.component').then(m => m.UnitsListComponent),
    title: 'Units - iBozzi',
    data: {
      showHeader: true,
      headerTitle: 'layout.units'
    },
  }
];
