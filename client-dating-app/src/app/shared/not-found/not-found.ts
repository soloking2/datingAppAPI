import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'dating-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  protected location = inject(Location);
}
