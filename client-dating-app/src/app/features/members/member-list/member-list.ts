import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MemberService } from '../services/member-service';
import { MemberCard } from "../components/member-card/member-card";

@Component({
  selector: 'dating-member-list',
  imports: [MemberCard],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css',
})
export class MemberList {
  private readonly memberService = inject(MemberService);
  protected memberList = toSignal(this.memberService.getMembers());
}
