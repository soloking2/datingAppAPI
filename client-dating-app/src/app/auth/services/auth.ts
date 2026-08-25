import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { IRegister, User } from '../../core/interfaces/User';
import { LocalStorage } from '../../core/services/local-storage';
import { environment } from '../../../environments/environment';
import { LikesService } from '../../features/members/services/likes-service';

@Service()
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(LocalStorage);
  private readonly likesService = inject(LikesService);
  private readonly baseUrl = `${environment.baseUrl}/account`;

  public currentUser = signal<User | null>(this.storageService.getItem<User>('user'));

  public login(credentials: { email: string; password: string }) {
    return this.http.post<User>(`${this.baseUrl}/login`, credentials).pipe(
      tap((user: User) => {
        this.setCurrentUser(user);
      }),
      catchError((error) => {
        console.error('Login failed', error);
        throw error;
      }),
    );
  }

  public register(payload: IRegister) {
    return this.http.post<User>(`${this.baseUrl}/register`, payload).pipe(
      tap((user) => {
        this.setCurrentUser(user);
      }),
    );
  }

  public logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.likesService.clearLikeIds();
    this.currentUser.set(null);
  }

  public setCurrentUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.likesService.likeIds();
    this.currentUser.set(user);
  }
}
