import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMessage, IMessageQuery } from '../../../core/interfaces/message';
import { PaginationResult } from '../../../core/interfaces/pagination';


@Service()
export class MessageService {
  private readonly baseUrl = environment.baseUrl;
  private readonly http = inject(HttpClient);

  getMessages(query: IMessageQuery) {
    return this.http.get<PaginationResult<IMessage[]>>(`${this.baseUrl}/messages`, {
      params: { ...query },
    });
  }

  getMessageThread(memberId: string) {
    return this.http.get<IMessage[]>(`${this.baseUrl}/messages/thread/${memberId}`);
  }

  sendMessage(recipientId: string, content: string) {
    return this.http.post<IMessage>(`${this.baseUrl}/messages`, { recipientId, content });
  }

  deleteMessage(id: string) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`);
  }
}
