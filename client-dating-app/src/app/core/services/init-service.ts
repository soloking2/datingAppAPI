import { inject, Service } from '@angular/core';
import { Auth } from '../../auth/services/auth';

import { tap } from 'rxjs';

@Service()
export class InitService {
  private readonly authService = inject(Auth);

  init() {
    return this.authService.refreshToken().pipe(
      tap((user) => {
        this.authService.setCurrentUser(user);
        this.authService.startTokenRefreshTimer();
      }),
    );
  }
}
