import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../../auth/services/auth';
import { ToastService } from '../services/toast-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const toastService = inject(ToastService);

  if (
    authService.currentUser()?.roles?.includes('Admin') ||
    authService.currentUser()?.roles?.includes('Moderator')
  ) {
    return true;

  } else {
    toastService.error("You are not permitted to view this area");
    return false;
  }
};
