import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { DisplayErrorMessage } from '../../utilities/input-validation';

@Component({
  selector: 'dating-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
})
export class TextInput implements ControlValueAccessor {
  label = input<string>('');
  type = input<string>('text');
  maxDate = input<string>('')
  displayError = DisplayErrorMessage;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void { /*  document why this method 'writeValue' is empty */ }
  registerOnChange(fn: any): void { /* Later document why this method 'registerOnChange' is empty */ }
  registerOnTouched(fn: any): void { /* Do document why this method 'registerOnTouched' is empty */ }

  get control() {
    return this.ngControl.control as FormControl;
  }
}
