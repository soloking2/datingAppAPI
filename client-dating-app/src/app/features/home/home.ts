import { Component, inject, signal } from '@angular/core';
import { Register } from '../../auth/register/register';
import { Auth } from '../../auth/services/auth';
import { IRegister } from '../../core/interfaces/User';
import { Router } from '@angular/router';

@Component({
  selector: 'dating-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly authService = inject(Auth);
  private readonly router = inject(Router);
  protected registerMode = signal(false);
  protected isRegistering = signal(false);
  protected validationErrors = signal<string[]>([]);


  handleRegisterMode() {
    this.registerMode.set(true);
  }

  handleCloseRegisterMode(mode: boolean) {
    this.registerMode.set(mode);
  }

  handleRegister(registerUser: IRegister) {
    this.validationErrors.set([]);
    this.authService.register(registerUser).subscribe({
      next: (response) => {
        if (response) {
          this.isRegistering.set(false);
          this.registerMode.set(false);
          this.router.navigate(["/member-list"])
        }
      },
      error: (error) => {
        this.validationErrors.set(error);
        this.isRegistering.set(false);
      },
    });
  }
}
