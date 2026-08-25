import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { IEditMember, IMember, Photo } from '../../../core/interfaces/member';
import { environment } from '../../../../environments/environment';
import { tap } from 'rxjs';
import { IQuery, PaginationResult } from '../../../core/interfaces/pagination';
import { LocalStorage } from '../../../core/services/local-storage';

@Service()
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  private readonly storageService = inject(LocalStorage);
  public editProfile = signal(false);
  public member = signal<IMember | null>(null);

  getMembers(query?: IQuery) {
    return this.http
      .get<PaginationResult<IMember[]>>(`${this.baseUrl}/members`, { params: { ...query } })
      .pipe(
        tap(() => {
          this.storageService.setItem('filters', query);
        }),
      );
  }

  getMemberById(id: string) {
    return this.http
      .get<IMember>(`${this.baseUrl}/members/${id}`)
      .pipe(tap((member) => this.member.set(member)));
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(`${this.baseUrl}/members/${id}/photos`);
  }

  updateMember(member: IEditMember) {
    return this.http.put(`${this.baseUrl}/members`, member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.baseUrl}/members/add-photo`, formData);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(`${this.baseUrl}/members/set-main-photo/${photoId}`, {});
  }

  deleteMemberPhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}/members/delete-photo/${photoId}`);
  }
}
