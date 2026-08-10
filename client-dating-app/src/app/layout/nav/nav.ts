import { Component, computed, inject, signal } from '@angular/core';
import { Login } from '../../auth/login/login';
import { User } from '../../core/interfaces/User';
import { UserProfile } from '../user-profile/user-profile';
import { Auth } from '../../auth/services/auth';

@Component({
  selector: 'dating-nav',
  imports: [Login, UserProfile],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  private readonly authService = inject(Auth);
  protected isLoggedIn = computed(() => !!this.authService.currentUser());
  protected user = signal<User | null>(this.authService.currentUser());

  protected handleUserLoggedIn(user: User) {
    this.user.set(user);
  }

  protected logout(logout: boolean) {
    if (logout) this.authService.logout();
  }
}
