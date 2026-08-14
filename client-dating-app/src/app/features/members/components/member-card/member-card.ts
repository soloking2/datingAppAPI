import { Component, input } from '@angular/core';
import { IMember } from '../../../../core/interfaces/member';
import { AgeOldPipe } from "../../../../core/pipe/age-old-pipe";
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dating-member-card',
  imports: [AgeOldPipe, TitleCasePipe, RouterLink],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css',
})
export class MemberCard {
  member = input.required<IMember>();
}
