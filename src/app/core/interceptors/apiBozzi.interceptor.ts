import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { FirebaseService } from '@/core/services/firebase.service';
import { environment } from '@/environments/environments';

export const apiBozziInterceptor: HttpInterceptorFn = (req, next) => {
  const fbService = inject(FirebaseService);
  const user: any = fbService.getCurrentUser();
  const isLoggedIn = user && user.accessToken;
  const isApiUrl = req.url.startsWith(environment.apiBozzi);

  if (isLoggedIn && isApiUrl) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.accessToken}`
      }
    });
    return next(authReq);
  }

  return next(req);
};