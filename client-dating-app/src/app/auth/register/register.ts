import {
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ProfileForm, UserRegister } from '../../core/interfaces/IRegister';
import { DisplayErrorMessage } from '../../shared/utilities/input-validation';
import { TextInput } from '../../shared/components/text-input/text-input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IRegister } from '../../core/interfaces/User';

@Component({
  selector: 'dating-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = inject(DestroyRef);
  protected credentialsForm!: FormGroup<UserRegister>;
  protected profileForm!: FormGroup<ProfileForm>;
  registerOutput = output<IRegister>();
  isRegistering = model<boolean>(false);
  cancelOutput = output<boolean>();
  validationErrors = input.required<string[]>();
  displayError = DisplayErrorMessage;
  displayName = signal('Display name');

  maxDate = computed(() => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  });

  protected currentStep = signal(1);

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.credentialsForm = this.fb.nonNullable.group<UserRegister>({
      displayName: this.fb.nonNullable.control('', [Validators.required]),
      email: this.fb.nonNullable.control('', [Validators.required]),
      password: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: this.fb.nonNullable.control('', [
        Validators.required,
        this.matchValues('password'),
      ]),
    });

    this.profileForm = this.fb.nonNullable.group<ProfileForm>({
      gender: this.fb.nonNullable.control('', [Validators.required]),
      dateOfBirth: this.fb.nonNullable.control('', [Validators.required]),
      city: this.fb.nonNullable.control('', [Validators.required]),
      country: this.fb.nonNullable.control('', [Validators.required]),
    });

    this.credentialsFormData.password.valueChanges
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => {
        this.credentialsFormData.confirmPassword.updateValueAndValidity();
      });
  }

  get credentialsFormData() {
    return this.credentialsForm.controls;
  }

  protected onSubmit() {
    if(!this.credentialsForm.valid && !this.profileForm.valid) {
      return;
    }
    const {email, displayName, password} = this.credentialsForm.value;;
    const {gender, city, country, dateOfBirth} = this.profileForm.value
    const registerPayload: IRegister = {
      email,
      displayName,
      password,
      gender,
      dateOfBirth,
      city,
      country

    } as IRegister;
    this.registerOutput.emit(registerPayload);
    this.isRegistering.update((registering) => !registering);
  }

  protected cancel() {
    this.cancelOutput.emit(false);
  }

  protected nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update((prev) => prev + 1);
    }
  }
  protected prevStep() {
    this.currentStep.update((cur) => cur - 1);
  }

  private matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;
      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true };
    };
  }
}
