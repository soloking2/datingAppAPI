import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../services/auth';
import { User } from '../../core/interfaces/User';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dating-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly destory$ = inject(DestroyRef);
  private readonly user = signal<User | null>(null);

  protected creds: { email: string; password: string } = {
    email: '',
    password: '',
  };

  public userOutput = output<User>();

  protected login() {
    if (!this.creds.email || !this.creds.password) {
      return;
    }
    this.auth
      .login(this.creds)
      .pipe(takeUntilDestroyed(this.destory$))
      .subscribe({
        next: (response) => {
          this.user.set(response as User);
          this.userOutput.emit(this.user() as User);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
  }
}
