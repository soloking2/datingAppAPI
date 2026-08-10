import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { catchError, EMPTY, tap } from 'rxjs';
import { User } from '../../core/interfaces/User';
import { LocalStorage } from '../../core/services/local-storage';
import { UserRegister } from '../../core/interfaces/IRegister';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(LocalStorage);
  private readonly baseUrl = 'https://localhost:5001/api/account';

  public currentUser = signal<User | null>(this.storageService.getItem<User>('user'));

  public login(credentials: { email: string; password: string }) {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials).pipe(
      tap((user: User) => {
        this.setCurrentUser(user);
      }),
      catchError((error) => {
        console.error('Login failed', error);
        return EMPTY;
      }),
    );
  }

  public register(payload: UserRegister) {
    return this.http.post<User>(`${this.baseUrl}/register`, payload).pipe(
      tap((user) => {
        this.setCurrentUser(user)
      }),
      catchError((error) => {
        throw error;
      }),
    );
  }

  public logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  private setCurrentUser(user: User) {
    this.storageService.setItem('user', user);
    this.currentUser.set(user);
  }
}
