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
import { AgeOldPipe } from '../../../core/pipe/age-old-pipe';
import { IMember } from '../../../core/interfaces/member';
import { filter } from 'rxjs';
import { Auth } from '../../../auth/services/auth';

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
  protected readonly memberService = inject(MemberService);

  protected member = signal<IMember | null>(null);
  protected title = signal<string | undefined>('');
  protected isCurrentUser = computed(() => {
    return this.authService.currentUser()?.id === this.paramMap()?.get('id')
  });
  protected editMode = computed(() => this.memberService.editProfile());

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title);
    this.route.data.pipe(takeUntilDestroyed(this.destroy$)).subscribe((data) => {
      if (data['member']) {
        this.member.set(data['member']);
      }
    });
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
}
