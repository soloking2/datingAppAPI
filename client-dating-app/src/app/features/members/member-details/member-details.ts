import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../services/member-service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AgeOldPipe } from '../../../core/pipes/age-old-pipe';
import { filter } from 'rxjs';
import { Auth } from '../../../auth/services/auth';
import { Location } from '@angular/common';
import { PresenceService } from '../../../core/services/presence-service';
import { LikesService } from '../services/likes-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'dating-member-details',
  imports: [AgeOldPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(Auth);
  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly destroy$ = inject(DestroyRef);
  private readonly presenceService = inject(PresenceService);
  private readonly likesService = inject(LikesService);
  private readonly toastService = inject(ToastService);

  protected readonly memberService = inject(MemberService);
  protected readonly location = inject(Location);
  protected member = computed(() => this.memberService.member());
  protected title = signal<string | undefined>('');

  protected isCurrentUser = computed(() => {
    return this.authService.currentUser()?.id === this.paramMap()?.get('id');
  });
  protected editMode = computed(() => this.memberService.editProfile());
  protected isOnline = computed(() =>
    this.presenceService.onlineUsers().includes(this.member()?.id as string),
  );
  protected isLiked = computed(() =>
    this.likesService.likeIds().includes(this.paramMap()?.get('id') as string),
  );

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title);
    this.getNavigationEnd();
  }

  private getNavigationEnd() {
    this.router.events
      .pipe(
        filter((events) => events instanceof NavigationEnd),
        takeUntilDestroyed(this.destroy$),
      )
      .subscribe(() => {
        this.title.set(this.route.firstChild?.snapshot?.title);
      });
  }

  handleLike(memberId: string) {
    this.likesService
      .toggleLike(memberId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          if (this.likesService.likeIds().includes(memberId)) {
            this.likesService.likeIds.update((prevIds) => prevIds.filter((id) => id !== memberId));
          } else {
            this.likesService.likeIds.update((prevIds) => [...prevIds, memberId]);
          }
        },
        error: (err) => {
          this.toastService.error(err.error);
        },
      });
  }
}
