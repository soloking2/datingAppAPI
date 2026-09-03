import { Component, computed, input, output, Signal } from '@angular/core';
import { IMember } from '../../../../core/interfaces/member';
import { AgeOldPipe } from '../../../../core/pipes/age-old-pipe';
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
  likedIds = input<string[]>([]);
  onlineUsers = input<string[]>([]);
  isLiked = computed(() => this.likedIds().includes(this.member().id));
  isOnline = computed(() => this.onlineUsers().includes(this.member().id));

  likeOutput = output<{ targetMemberId: string; hasLiked: Signal<boolean> }>();

  onHandleLike(targetMemberId: string, event: Event) {
    event.stopPropagation();
    this.likeOutput.emit({ targetMemberId, hasLiked: this.isLiked });
  }
}
