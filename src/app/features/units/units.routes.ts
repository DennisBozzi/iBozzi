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
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/new-unit/new-unit.component').then(m => m.NewUnitComponent),
    title: 'New Unit - iBozzi',
    data: {
      showHeader: true,
      headerTitle: 'units.newUnit',
      showArrow: true
    },
  }
];
