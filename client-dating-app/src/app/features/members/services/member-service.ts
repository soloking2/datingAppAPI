import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { IMember, Photo } from '../../../core/interfaces/member';
import { environment } from '../../../../environments/environment';

@Service()
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;
  public editProfile = signal(false);

  getMembers() {
    return this.http.get<IMember[]>(`${this.baseUrl}/members`);
  }

  getMemberById(id: string) {
    return this.http.get<IMember>(`${this.baseUrl}/members/${id}`);
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(`${this.baseUrl}/members/${id}/photos`)
  }
}
