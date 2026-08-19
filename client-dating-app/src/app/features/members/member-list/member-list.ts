import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MemberService } from '../services/member-service';
import { MemberCard } from '../components/member-card/member-card';
import { Paginator } from '../../../shared/paginator/paginator';
import { IQuery, PaginationResult } from '../../../core/interfaces/pagination';
import { IMember } from '../../../core/interfaces/member';

@Component({
  selector: 'dating-member-list',
  imports: [MemberCard, Paginator],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly destroy$ = inject(DestroyRef);
  pagination: IQuery = {
    pageNumber: 1,
    pageSize: 5,
  };
  protected memberList = signal<PaginationResult<IMember[]> | null>(null);

  ngOnInit(): void {
    this.loadMember(this.pagination);
  }

  onPageChange($event: IQuery) {
    console.log($event);
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
}
