import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { MemberService } from '../services/member-service';
import { IMember } from '../../../core/interfaces/member';

export const memberResolverResolver: ResolveFn<IMember> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router)
  const memberId = route.paramMap.get("id") as string;

  if(!memberId) {
    router.navigateByUrl("**")
  }
  return memberService.getMemberById(memberId);
};
