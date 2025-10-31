import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { guestGuard } from '@/core/guards/guest.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
    title: 'Login - iBozzi'
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [guestGuard],
    title: 'Register - iBozzi'
  }
];
