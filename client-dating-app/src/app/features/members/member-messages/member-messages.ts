import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MemberService } from '../services/member-service';
import { MessageService } from '../../messages/services/message-service';
import { IMessage } from '../../../core/interfaces/message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dating-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit {
  @ViewChild('messageEndRef') messageRef!: ElementRef;
  private readonly messageService = inject(MessageService);
  private readonly memberService = inject(MemberService);
  private readonly destroy$ = inject(DestroyRef);

  protected readonly messages = signal<IMessage[]>([]);
  protected readonly memberId = computed(() => this.memberService.member()?.id as string);
  protected messageContent = '';

  constructor() {
    effect(() => {
      if(this.messages().length > 0) {
        this.scrollToBottom()
      }
    })
  }

  ngOnInit(): void {
    this.loadMessages(this.memberId());
  }

  loadMessages(memberId: string) {
    this.messageService
      .getMessageThread(memberId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messages.set(
            response.map((message) => ({
              ...message,
              currentUserSender: message.senderId !== this.memberId(),
            })),
          );
        },

      });
  }

  sendMessage() {
    if (!this.messageContent && !this.memberId()) return;
    this.messageService
      .sendMessage(this.memberId(), this.messageContent)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messages.update((prev) => {
            const currentMessage = { ...response, currentUserSender: true };
            return [...prev, currentMessage];
          });
          this.messageContent = '';
        },
      });
  }



  scrollToBottom() {
    setTimeout(() => {
      if (this.messageRef) {
        this.messageRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }

    })
  }
}
