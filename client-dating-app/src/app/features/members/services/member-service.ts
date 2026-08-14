import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { IMember } from '../../../core/interfaces/member';
import { environment } from '../../../../environments/environment';

@Service()
export class MemberService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getMembers() {
    return this.http.get<IMember[]>(`${this.baseUrl}/members`);
  }

  getMemberById(id: string) {
    return this.http.get<IMember>(`${this.baseUrl}/members/${id}`);
  }
}
