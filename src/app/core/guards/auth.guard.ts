import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const firebaseService = inject(FirebaseService);
  const router = inject(Router);

  const result = await firebaseService.getUser();
  if (!result.data.user) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};