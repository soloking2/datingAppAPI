import { Component, inject, signal } from '@angular/core';
import { MemberService } from '../services/member-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dating-member-photos',
  imports: [],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);

  protected photos = signal([])
}
