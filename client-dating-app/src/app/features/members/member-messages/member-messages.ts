import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MemberService } from '../services/member-service';
import { MessageService } from '../../messages/services/message-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dating-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css',
})
export class MemberMessages implements OnInit, OnDestroy {
  @ViewChild('messageEndRef') messageRef!: ElementRef;
  private readonly messageService = inject(MessageService);
  private readonly memberService = inject(MemberService);
  private readonly destroy$ = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  protected readonly presenceService = inject(PresenceService);
  protected readonly messages = computed(() => this.messageService.messageThread());
  protected readonly memberId = computed(() => this.memberService.member()?.id as string);
  isOnline = computed(() => this.presenceService.onlineUsers().includes(this.memberId()));
  public messageContent = "";

  constructor() {
    effect(() => {
      if (this.messages().length > 0) {
        this.scrollToBottom();
      }
    });
  }

  ngOnInit(): void {
    this.route.parent?.paramMap.pipe(takeUntilDestroyed(this.destroy$)).subscribe((params) => {
      const otherUserId = params.get('id');
      if (!otherUserId) throw new Error('Cannot connect to hub');
      this.messageService.createConnection(otherUserId);
    });
  }

  sendMessage() {
    if (!this.messageContent && !this.memberId()) return;
    this.messageService.sendMessage(this.memberId(), this.messageContent)
    .then(() => {
      this.messageContent = "";
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageRef) {
        this.messageRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}
