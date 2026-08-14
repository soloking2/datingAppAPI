import { Component, computed, inject } from '@angular/core';
import { MemberService } from '../services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../../core/interfaces/member';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dating-member-photos',
  imports: [],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);


  private readonly photos$ = toSignal(this.memberService.getMemberPhotos(this.route.parent?.snapshot.paramMap.get("id") as string))

  protected photos = computed<Photo[]>(() => this.photos$() as Photo[]);

  get mockPhotos() {
    return Array.from({length: 20}, (_, i) => ({
      url: '/user.png'
    }))
  }
}
