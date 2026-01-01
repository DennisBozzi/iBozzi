import { BreadcrumbItem } from '@/shared/interfaces';
import { Routes } from '@angular/router';

export const CONTRACTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/contracts-list/contracts-list.component').then(m => m.ContractsListComponent),
    title: 'Contracts - iBozzi',
    data: {
      showHeader: true,
      headerTitle: 'layout.contracts'
    },
  },
  {
    path: 'template',
    loadComponent: () => import('./pages/template-contract/template-contract.component').then(m => m.TemplateContractComponent),
    title: 'Template - iBozzi',
    data: {
      showHeader: true,
      breadCrumb: [
        { label: 'layout.contracts', url: '/contracts' },
        { label: 'layout.template', url: '/contracts/template' }
      ] as BreadcrumbItem[],
    },
  },
];
