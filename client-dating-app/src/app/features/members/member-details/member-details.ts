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

@Component({
  selector: 'dating-member-details',
  imports: [AgeOldPipe, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './member-details.html',
  styleUrl: './member-details.css',
})
export class MemberDetails implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paramMap = toSignal(this.route.paramMap);
  private readonly userId = computed(() => this.paramMap()?.get('id') as string);
  private readonly destroy$ = inject(DestroyRef);

  protected member = signal<IMember | null>(null);
  protected title = signal<string | undefined>('');

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
