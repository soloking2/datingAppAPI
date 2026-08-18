import {inject } from '@angular/core';
import {ResolveFn, Router } from '@angular/router';
import { MemberService } from '../services/member-service';
import { IMember } from '../../../core/interfaces/member';
import { EMPTY } from 'rxjs';

export const memberResolverResolver: ResolveFn<IMember> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  let memberId = route.paramMap.get("id") as string;

  if (!memberId) {
    router.navigateByUrl('**');
    return EMPTY;
  }
  return memberService.getMemberById(memberId);
};
