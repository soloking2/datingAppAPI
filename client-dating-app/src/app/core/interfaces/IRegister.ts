import { FormControl } from "@angular/forms";

export interface UserRegister {
  displayName: FormControl<string | null>;
  email: FormControl<string>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export interface ProfileForm {
  gender: FormControl<string | null>;
  city: FormControl<string | null>;
  dateOfBirth: FormControl<string | null>;
  country: FormControl<string | null>;
}
