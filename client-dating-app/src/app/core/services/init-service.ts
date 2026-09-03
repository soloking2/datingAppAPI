import { inject, Service } from '@angular/core';
import { Auth } from '../../auth/services/auth';

import { tap } from 'rxjs';
import { LikesService } from '../../features/members/services/likes-service';

@Service()
export class InitService {
  private readonly authService = inject(Auth);
  private readonly likesService = inject(LikesService);

  init() {
    return this.authService.refreshToken().pipe(
      tap((user) => {
        this.authService.setCurrentUser(user);
        this.likesService.getLikeIds();
        this.authService.startTokenRefreshTimer();
      }),
    );
  }
}
