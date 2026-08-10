import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../auth/services/auth';
import { ToastService } from '../services/toast-service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);
  const toastService = inject(ToastService);

  if (authService.currentUser()) {
    return true;
  }

  toastService.error('You are not authenticated');
  router.navigateByUrl('/');
  return false;
};
