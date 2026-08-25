import { DestroyRef, inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMember } from '../../../core/interfaces/member';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IQuery, PaginationResult } from '../../../core/interfaces/pagination';

@Service()
export class LikesService {
  private readonly baseUrl = environment.baseUrl;
  private readonly destroy$ = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  public likeIds = signal<string[]>([]);

  toggleLike(targetMemberId: string) {
    return this.http.post(`${this.baseUrl}/likes/${targetMemberId}`, {});
  }

  getLikes(predicate: string, query?: IQuery) {
    return this.http.get<PaginationResult<IMember[]>>(`${this.baseUrl}/likes?predicate=${predicate}`, {params: {...query}});
  }

  getLikeIds() {
    this.http.get<string[]>(`${this.baseUrl}/likes/list`)
    .pipe(
      takeUntilDestroyed(this.destroy$)
    )
    .subscribe((response) => {
      this.likeIds.set(response);
    });
  }

  clearLikeIds() {
    this.likeIds.set([]);
  }
}
