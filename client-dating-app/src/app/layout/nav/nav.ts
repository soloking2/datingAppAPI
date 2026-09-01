import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Login } from '../../auth/login/login';
import { User } from '../../core/interfaces/User';
import { UserProfile } from '../user-profile/user-profile';
import { Auth } from '../../auth/services/auth';
import { Router, RouterModule } from '@angular/router';
import { ToastService } from '../../core/services/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorage } from '../../core/services/local-storage';
import { themes } from '../theme';
import { TitleCasePipe } from '@angular/common';
import { HasRole } from '../../core/directives/has-role';

@Component({
  selector: 'dating-nav',
  imports: [Login, UserProfile, RouterModule, TitleCasePipe, HasRole],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  private readonly authService = inject(Auth);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly storageService = inject(LocalStorage);
  private readonly destory$ = inject(DestroyRef);

  protected isLoggedIn = computed(() => !!this.authService.currentUser());
  protected user = computed<User | null>(() => this.authService.currentUser());
  protected selectedtheme = signal<string>(this.storageService.getItem<string>('theme') || 'light');
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.dataset['theme'] = this.selectedtheme();
  }

  protected handleUserLoggedIn(user: { email: string; password: string }) {
    this.authService
      .login(user)
      .pipe(takeUntilDestroyed(this.destory$))
      .subscribe({
        next: (response) => {
          this.authService.currentUser.set(response as User);
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

  public handleSelectTheme(theme: string) {
    this.selectedtheme.set(theme);
    this.storageService.setItem('theme', theme);
    // Prefer using dataset over setAttribute for data-* attributes
    document.documentElement.dataset['theme'] = theme;
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }
}
