import { Component, input, output } from '@angular/core';

@Component({
  selector: 'dating-delete-button',
  imports: [],
  templateUrl: './delete-button.html',
})
export class DeleteButton {
  disabled = input<boolean>();
  emitClick = output<Event>();
}
