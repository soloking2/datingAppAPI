import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMessage, IMessageQuery } from '../../../core/interfaces/message';
import { PaginationResult } from '../../../core/interfaces/pagination';
import { Auth } from '../../../auth/services/auth';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Service()
export class MessageService {
  private readonly baseUrl = environment.baseUrl;
  private readonly hubUrl = environment.hubUrl;
  private readonly authService = inject(Auth);
  private readonly http = inject(HttpClient);
  private hubConnection!: HubConnection;
  messageThread = signal<IMessage[]>([]);

  createConnection(otherUserId: string) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/messages?userId=${otherUserId}`, {
        accessTokenFactory: () => currentUser.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((error) => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', (messages: IMessage[]) => {
      this.messageThread.set(
        messages.map((message) => ({
          ...message,
          currentUserSender: message.senderId !== otherUserId,
        })),
      );
    });
    this.hubConnection.on('NewMessage', (message: IMessage) => {
      this.messageThread.update((messages) => {
        const currentMessage = {
          ...message,
          currentUserSender: message.senderId === currentUser.id,
        };
        return [...messages, currentMessage];
      });
    });
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((error) => console.log(error));
    }
  }

  getMessages(query: IMessageQuery) {
    return this.http.get<PaginationResult<IMessage[]>>(`${this.baseUrl}/messages`, {
      params: { ...query },
    });
  }

  getMessageThread(memberId: string) {
    return this.http.get<IMessage[]>(`${this.baseUrl}/messages/thread/${memberId}`);
  }

  sendMessage(RecipientId: string, Content: string) {
    return this.hubConnection?.invoke('SendMessage', { RecipientId, Content });
  }

  deleteMessage(id: string) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`);
  }
}
