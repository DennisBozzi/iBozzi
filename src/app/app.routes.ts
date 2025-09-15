import { Routes } from '@angular/router';
import { redirectGuard } from './guards/redirect.guard';
import authRoutes from './routes/auth.routes';
import pagesRoutes from './routes/pages.routes';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    ...authRoutes,
    ...pagesRoutes,
    { path: '**', canActivate: [redirectGuard], children: [] }
];
