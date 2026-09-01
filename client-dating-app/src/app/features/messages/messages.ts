import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Metadata, Tab } from '../../core/interfaces/pagination';
import { MessageService } from './services/message-service';
import { IMessage, IMessageQuery } from '../../core/interfaces/message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Paginator } from "../../shared/paginator/paginator";
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'dating-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly destroy$ = inject(DestroyRef);


  protected readonly messages = signal<IMessage[]>([]);
  protected readonly metaData = signal<Metadata>({} as Metadata)
  public tabs = signal<Tab[]>([
    {
      label: 'Inbox',
      value: 'Inbox',
    },
    {
      label: 'Outbox',
      value: 'Outbox',
    },

  ]);

  protected pagination = signal<IMessageQuery>({
    pageNumber: 1,
    pageSize: 10
  })
  protected container = signal("Inbox");
  protected isInbox = computed(() => this.container() === "Inbox");

  ngOnInit(): void {
    this.loadMessages(this.pagination())
  }

  private loadMessages(query: IMessageQuery) {
    this.messageService.getMessages(query).pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe(response => {
      this.messages.set(response.items);
      this.metaData.set(response.metadata);
    })
  }

  setContainer(container: string) {
    if(this.container() !== container) {
      this.container.set(container);
      this.pagination.update((prev) => ({...prev, pageNumber: 1, container: this.container()}))
      this.loadMessages(this.pagination())
    }
  }

  onPageChange(query: IMessageQuery) {
    this.pagination.update((prev) => ({ ...prev, ...query }));
    this.loadMessages(this.pagination());
  }

  deleteMessage(event: Event, id: string) {
    event.stopPropagation();
    this.messageService.deleteMessage(id).pipe(
      takeUntilDestroyed(this.destroy$)
    ).subscribe({
      next: () => {
        this.loadMessages(this.pagination())
      }
    })
  }
}
