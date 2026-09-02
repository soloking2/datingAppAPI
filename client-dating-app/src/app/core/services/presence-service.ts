import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast-service';
import { User } from '../interfaces/User';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { IMessage } from '../interfaces/message';

@Service()
export class PresenceService {
  private readonly hubUrl = environment.hubUrl;
  private readonly toastService = inject(ToastService);
  public hubConnection!: HubConnection;
  public onlineUsers = signal<string[]>([]);

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/presence`, {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().catch((err) => console.log(err));

    this.hubConnection.on('UserOnline', (userId) => {
      this.onlineUsers.update((prev) => [...prev, userId]);
    });

    this.hubConnection.on('UserOffline', (userId) => {
      this.onlineUsers.update((prev) => prev.filter((x) => x !== userId));
    });

    this.hubConnection.on('GetOnlineUsers', (userIds) => {
      this.onlineUsers.set(userIds);
    });

    this.hubConnection.on('NewMessageReceived', (message: IMessage) => {
      this.toastService.info(
        `${message.senderDisplayName} has sent you a message`,
        10000,
        message.senderImageUrl,
        `/member-list/${message.senderId}/messages`,
      );
    });
  }

  stopHubConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch((err) => console.log(err));
    }
  }
}
