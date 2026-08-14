import { inject, Service } from '@angular/core';
import { Auth } from '../../auth/services/auth';
import { LocalStorage } from './local-storage';
import { User } from '../interfaces/User';
import { of } from 'rxjs';

@Service()
export class InitService {
  private readonly authService = inject(Auth);
  private readonly storageService = inject(LocalStorage);

  init() {
    const user = localStorage.getItem('user');
    if(!user) return null;

    this.authService.currentUser.set(JSON.parse(user) as User);

    return of(null);
  }
}
