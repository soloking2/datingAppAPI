import { Component, input, output } from '@angular/core';

@Component({
  selector: 'dating-star-button',
  imports: [],
  templateUrl: './star-button.html',
})
export class StarButton {
  disabled = input<boolean>(false);
  emitClick = output<Event>();
  isSelected = input<boolean>(false);

}
