import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../../auth/services/auth';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const user = authService.currentUser();
  if (user?.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
  }
  return next(req);
};
