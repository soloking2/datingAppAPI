import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast-service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((error) => {
      switch (error.status) {
        case 400:
          if (error.error.errors) {
            const errorMessage = error.error.errors;
            const modelStateErrors = [];
            for (let error in errorMessage) {
              if (errorMessage[error]) {
                modelStateErrors.push(errorMessage[error]);
              }
            }
            throw modelStateErrors.flat();
          } else {
            toastService.error(error.error);
          }
          break;

        case 401:
          toastService.error('You are not authorized');
          router.navigateByUrl('/');

          break;
        case 404:
          router.navigate(['**']);
          break;
        case 500:
          router.navigate(['server-error'], { state: { error: error.error } });
          break;
        default:
          toastService.error('Something went wrong');
          break;
      }
      throw error;
    }),
  );
};
