import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserRegister } from '../../core/interfaces/IRegister';

@Component({
  selector: 'dating-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  protected credentials: UserRegister = {} as UserRegister;
  registerOutput = output<UserRegister>();
  isRegistering = model<boolean>(false);
  cancelOutput = output<boolean>();
  validationErrors = input.required<string[]>();

  protected onSubmit() {
    if (Object.keys(this.credentials).length === 0) return;
    this.registerOutput.emit(this.credentials);
    this.isRegistering.update((registering) => !registering);
  }

  protected cancel() {
    this.cancelOutput.emit(false);
  }
}
