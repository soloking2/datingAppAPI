import {
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IEditMember, IMember } from '../../../core/interfaces/member';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MemberService } from '../services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { Auth } from '../../../auth/services/auth';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'dating-member-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipe],
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
  private readonly destroy$ = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(Auth);

  protected member = computed(() => this.memberService.member());

  protected editMode = computed(() => this.memberService.editProfile());

  protected editableMember!: IEditMember;

  ngOnInit(): void {
    this.route.parent?.data.subscribe((data) => {
      if (data?.['member']) {
        this.editableMember = { ...this.prefillEditableMember(data?.['member'] as IMember) };
      }
    });
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
    this.memberService
      .updateMember(this.editableMember)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          const currentUser = this.authService.currentUser();
          if (currentUser && updatedMember.displayName !== currentUser.name) {
            const updatedUser = {
              ...currentUser,
              name: updatedMember.displayName,
            };
            this.authService.currentUser.update((prev) => updatedUser);
            this.authService.setCurrentUser(updatedUser);
          }

          this.toastService.success('Member updated successfully');
          this.memberService.member.set(updatedMember as IMember);
          this.editForm.reset(updatedMember);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.editMode()) {
      this.memberService.editProfile.set(false);
    }
  }
}
