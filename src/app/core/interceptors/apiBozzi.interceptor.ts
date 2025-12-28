import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { FirebaseService } from '@/core/services/firebase.service';
import { environment } from '@/environments/environments';
import { catchError, throwError, switchMap } from 'rxjs';
import { Router } from '@angular/router';

export const apiBozziInterceptor: HttpInterceptorFn = (req, next) => {
  const fbService = inject(FirebaseService);
  const router = inject(Router);
  const user: any = fbService.getCurrentUser();
  const isLoggedIn = user && user.accessToken;
  const isApiUrl = req.url.startsWith(environment.apiBozzi);

  if (isLoggedIn && isApiUrl) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user.accessToken}`
      }
    });
    return next(authReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return fbService.refreshToken().pipe(
            switchMap(() => {
              const updatedUser: any = fbService.getCurrentUser();
              const updatedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${updatedUser.accessToken}`
                }
              });
              return next(updatedReq);
            }),
            catchError((refreshError) => {
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};