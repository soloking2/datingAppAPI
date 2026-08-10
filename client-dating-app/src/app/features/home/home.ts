import { Component, inject, signal } from '@angular/core';
import { Register } from '../../auth/register/register';
import { Auth } from '../../auth/services/auth';
import { UserRegister } from '../../core/interfaces/IRegister';
import { ToastService } from '../../core/services/toast-service';

@Component({
  selector: 'dating-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private readonly authService = inject(Auth);
  private readonly toastService = inject(ToastService);
  protected registerMode = signal(false);
  protected isRegistering = signal(false);

  handleRegisterMode() {
    this.registerMode.set(true);
  }

  handleCloseRegisterMode(mode: boolean) {
    this.registerMode.set(mode);
  }

  handleRegister(registerUser: UserRegister) {
    this.authService.register(registerUser).subscribe({
      next: (response) => {
        if (response) {
          this.isRegistering.set(false);
          this.registerMode.set(false);
          window.location.reload();
        }
      },
      error: (error) => {
        console.log(error);
        this.toastService.error(error.error)
        this.isRegistering.set(false);
      },
    });
  }
}
