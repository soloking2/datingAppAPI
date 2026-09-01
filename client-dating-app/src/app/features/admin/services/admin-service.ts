import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/interfaces/User';

@Service()
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseUrl;

  getUserWithRoles() {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users-with-roles`);
  }

  editUserRole(userId: string, roles: string) {
    return this.http.post<string[]>(
      `${this.baseUrl}/admin/edit-roles/${userId}?roles=${roles}`,
      {},
    );
  }
}
