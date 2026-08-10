import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Login } from '../../auth/login/login';
import { User } from '../../core/interfaces/User';
import { UserProfile } from '../user-profile/user-profile';
import { Auth } from '../../auth/services/auth';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dating-nav',
  imports: [Login, UserProfile, RouterModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private readonly authService = inject(Auth);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  protected isLoggedIn = computed(() => !!this.authService.currentUser());
  protected user = signal<User | null>(this.authService.currentUser());
  private readonly destory$ = inject(DestroyRef);

  protected handleUserLoggedIn(user: { email: string; password: string }) {
    this.authService
      .login(user)
      .pipe(takeUntilDestroyed(this.destory$))
      .subscribe({
        next: (response) => {
          this.user.set(response as User);
          this.toastService.success('User has successfully logged in');
          this.router.navigate(['/member-list']);
        },
        error: (error) => {
          console.log('Login failed', error.error);
          this.toastService.error(error.error);
        },
      });
  }

  protected logout(logout: boolean) {
    if (logout) this.authService.logout();
    this.router.navigate(['/']);
  }
}
