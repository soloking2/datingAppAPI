import { Component, input, output } from '@angular/core';
import { User } from '../../core/interfaces/User';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'dating-user-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfile {
  user = input<User>();
  logOut = output<boolean>();

  protected logout() {
    this.logOut.emit(true);
  }

  handleSelectUserItem() {
    const elem = document.activeElement as HTMLDivElement;
    if (elem) elem.blur();
  }
}
