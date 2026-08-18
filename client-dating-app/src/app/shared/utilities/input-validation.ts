import { AbstractControl } from "@angular/forms";

export function DisplayErrorMessage(control: AbstractControl) {
  return !!(control.dirty && control.touched && control.invalid);
}
