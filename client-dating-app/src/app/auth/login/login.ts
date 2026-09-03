import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dating-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loading = model(false);
  protected creds: { email: string; password: string } = {
    email: '',
    password: '',
  };

  public userOutput = output<{email: string, password: string}>();

  protected login() {
    if (!this.creds.email || !this.creds.password) {
      return;
    }
    this.userOutput.emit(this.creds);

  }
}
