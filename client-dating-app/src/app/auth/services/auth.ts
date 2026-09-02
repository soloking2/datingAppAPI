import { HttpClient } from '@angular/common/http';
import { DestroyRef, inject, OnDestroy, Service, signal } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { IRegister, User } from '../../core/interfaces/User';
import { LocalStorage } from '../../core/services/local-storage';
import { environment } from '../../../environments/environment';
import { LikesService } from '../../features/members/services/likes-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PresenceService } from '../../core/services/presence-service';
import { HubConnectionState } from '@microsoft/signalr';

@Service()
export class Auth implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly storageService = inject(LocalStorage);
  private readonly likesService = inject(LikesService);
  private readonly presenceService = inject(PresenceService);
  private readonly baseUrl = `${environment.baseUrl}/account`;
  private readonly destroy$ = inject(DestroyRef);
  private intervalId!: number;

  public currentUser = signal<User | null>(null);

  public login(credentials: { email: string; password: string }) {
    return this.http
      .post<User>(`${this.baseUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((user: User) => {
          this.setCurrentUser(user);
          this.startTokenRefreshTimer();
        }),
        catchError((error) => {
          console.error('Login failed', error);
          throw error;
        }),
      );
  }

  public register(payload: IRegister) {
    return this.http
      .post<User>(`${this.baseUrl}/register`, payload, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this.setCurrentUser(user);
          this.startTokenRefreshTimer();
        }),
      );
  }

  public logout() {
    this.storageService.removeItem('filters');
    this.likesService.clearLikeIds();
    this.currentUser.set(null);
    this.presenceService.stopHubConnection();
  }

  public startTokenRefreshTimer() {
    this.intervalId = setInterval(
      () => {
        this.http
          .post<User>(
            `${this.baseUrl}/refresh-token`,
            {},
            {
              withCredentials: true,
            },
          )
          .pipe(takeUntilDestroyed(this.destroy$))
          .subscribe({
            next: (user) => {
              this.setCurrentUser(user);
            },
            error: () => {
              this.logout();
            },
          });
      },
      5 * 60 * 1000,
    ); // Refresh token every 5 minutes
  }

  public setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user);
    this.likesService.likeIds();
    this.currentUser.set(user);

    if (this.presenceService.hubConnection?.state !== HubConnectionState.Connected) {
      this.presenceService.createHubConnection(user);
    }
  }

  public refreshToken() {
    return this.http.post<User>(
      `${this.baseUrl}/refresh-token`,
      {},
      {
        withCredentials: true,
      },
    );
  }

  private getRolesFromToken(user: User): string[] {
    const token = user.token.split('.')[1];
    const encodedRole = atob(token);
    const jsonPayload = JSON.parse(encodedRole).role;
    return Array.isArray(jsonPayload) ? jsonPayload : [jsonPayload];
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
