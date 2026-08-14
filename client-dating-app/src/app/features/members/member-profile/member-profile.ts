import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IEditMember, IMember } from '../../../core/interfaces/member';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MemberService } from '../services/member-service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'dating-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnDestroy, OnInit {
  @ViewChild('editForm', { static: false }) editForm!: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  private readonly route = inject(ActivatedRoute);
  private readonly memberService = inject(MemberService);

  private readonly memberData = toSignal(this.route.data);
  protected member = computed<IMember | null>(() => this.memberData()?.['member']);

  protected editMode = computed(() => this.memberService.editProfile());

  protected editableMember!: IEditMember;

  ngOnInit(): void {
    this.editableMember = this.prefillEditableMember(this.member() as IMember);
  }

  public prefillEditableMember(member: IMember): IEditMember {
    return {
      displayName: member.displayName || '',
      description: member.description || '',
      city: member.city || '',
      country: member.country || '',
    };
  }

  public updateEditableMember() {
    if (Object.keys(this.editableMember).length === 0) return;
    const updatedMember = { ...this.member(), ...this.editableMember };
    console.log(updatedMember);
  }

  ngOnDestroy(): void {
    if (this.editMode()) {
      this.memberService.editProfile.set(false);
    }
  }
}
