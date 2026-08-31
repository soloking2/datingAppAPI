import { Component, computed, DestroyRef, inject, OnInit, Signal, signal } from '@angular/core';
import { LikesService } from '../members/services/likes-service';
import { IMember } from '../../core/interfaces/member';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberCard } from "../members/components/member-card/member-card";
import { ToastService } from '../../core/services/toast-service';
import { IQuery, Metadata, Tab } from '../../core/interfaces/pagination';
import { Paginator } from "../../shared/paginator/paginator";


@Component({
  selector: 'dating-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css',
})
export class Lists implements OnInit {
  private readonly likesService = inject(LikesService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  protected members = signal<IMember[]>([]);
  protected metaData = signal<Metadata | null>(null)
  protected predicate = signal<string>('liked');
  protected likedIds = computed(() => this.likesService.likeIds());

  public tabs = signal<Tab[]>([
    {
      label: 'Liked',
      value: 'liked',
    },
    {
      label: 'Liked me',
      value: 'likedBy',
    },
    {
      label: 'Mutual',
      value: 'mutual',
    },
  ]);

  ngOnInit() {
    this.loadLikedMembers(this.predicate());
  }

  loadLikedMembers(predicate: string, query?: IQuery) {
    this.likesService
      .getLikes(predicate, query)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((response) => {
        this.members.set(response.items);
        this.metaData.set(response.metadata);
      });
  }

  setPredicate(predicate: string) {
    if (this.predicate() !== predicate) {
      this.predicate.set(predicate);
      this.loadLikedMembers(this.predicate());
    }
  }

  handleLike(event: { targetMemberId: string; hasLiked: Signal<boolean> }) {
    this.likesService
      .toggleLike(event.targetMemberId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          if (event.hasLiked()) {
            this.likesService.likeIds.update((prevIds) =>
              prevIds.filter((id) => id !== event.targetMemberId),
            );
          } else {
            this.likesService.likeIds.update((prevIds) => [...prevIds, event.targetMemberId]);
          }
        },
        error: (err) => {
          this.toastService.error(err.error);
        },
      });
  }

  onPageChange($event: IQuery) {
      const pagination = { ...$event };
      this.loadLikedMembers(this.predicate(), pagination);
    }
}
