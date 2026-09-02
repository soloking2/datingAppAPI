import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberService } from '../services/member-service';
import { MemberCard } from '../components/member-card/member-card';
import { Paginator } from '../../../shared/paginator/paginator';
import { IQuery, PaginationResult } from '../../../core/interfaces/pagination';
import { IMember } from '../../../core/interfaces/member';
import { FilterModal } from '../../../shared/components/filter-modal/filter-modal';
import { LocalStorage } from '../../../core/services/local-storage';
import { LikesService } from '../services/likes-service';
import { ToastService } from '../../../core/services/toast-service';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  selector: 'dating-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modalRef!: FilterModal;
  private readonly memberService = inject(MemberService);
  protected readonly likesService = inject(LikesService);
  protected readonly presenceService = inject(PresenceService);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly storageService = inject(LocalStorage);
  pagination: IQuery = {
    pageNumber: 1,
    pageSize: 5,
    minAge: 18,
    maxAge: 100,
  };
  protected memberList = signal<PaginationResult<IMember[]> | null>(null);
  private readonly updatedQuery = signal<IQuery>(this.pagination);
  protected likedIds = computed(() => this.likesService.likeIds());

  protected generateMessage = computed(() => {
    const filter: string[] = [];
    if (this.updatedQuery().gender) {
      filter.push(`${this.updatedQuery().gender}s`);
    } else {
      filter.push('Males, Females');
    }

    if (
      this.updatedQuery().minAge !== this.pagination.minAge ||
      this.updatedQuery().maxAge !== this.pagination.maxAge
    ) {
      filter.push(` Ages ${this.updatedQuery().minAge} - ${this.updatedQuery().maxAge}`);
    }

    filter.push(
      this.updatedQuery().orderBy === 'lastActive' ? 'Recently active' : 'Newest members',
    );

    return filter.length > 0 ? `Selected : ${filter.join(' | ')}` : 'All members';
  });

  constructor() {
    const filters = this.storageService.getItem<IQuery>('filters');

    if (filters) {
      const pagination = {
        ...filters,
      };
      this.pagination = { ...this.pagination, ...pagination };
      this.updatedQuery.set(pagination);
    }
  }

  ngOnInit(): void {
    this.loadMember(this.pagination);
  }

  onPageChange($event: IQuery) {
    const pagination = { ...this.pagination, ...$event };
    this.loadMember(pagination);
  }

  loadMember(pagination: IQuery) {
    this.memberService
      .getMembers(pagination)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (response) => {
          this.memberList.set(response);
        },
      });
  }

  protected openModal() {
    this.modalRef.openModal();
  }

  onFilterChange(query: IQuery) {
    if (!query.gender) {
      delete query.gender;
    }
    const pagination = { ...this.pagination, ...query };
    this.updatedQuery.set({ ...pagination });
    this.loadMember(pagination);
  }

  onResetFilter() {
    const pagination = {
      pageNumber: 1,
      pageSize: 5,
      minAge: 18,
      maxAge: 100,
    };
    this.updatedQuery.set({ ...pagination });
    this.pagination = pagination;
    this.loadMember(pagination);
    this.storageService.removeItem('filters');
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
}
