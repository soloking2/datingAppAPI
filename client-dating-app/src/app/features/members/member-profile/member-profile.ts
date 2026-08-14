import { Component, computed, inject } from '@angular/core';
import { IMember } from '../../../core/interfaces/member';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dating-member-profile',
  imports: [],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile {
  private readonly route = inject(ActivatedRoute);
  private readonly memberData = toSignal(this.route.data);
  protected member = computed<IMember | null>(() => this.memberData()?.['member']);
}
