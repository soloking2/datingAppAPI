import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../services/member-service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../../../core/interfaces/member';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImageUpload } from '../../../shared/components/image-upload/image-upload';
import { ToastService } from '../../../core/services/toast-service';
import { Auth } from '../../../auth/services/auth';
import { StarButton } from '../../../shared/components/star-button/star-button';
import { DeleteButton } from '../../../shared/components/delete-button/delete-button';

@Component({
  selector: 'dating-member-photos',
  imports: [ImageUpload, StarButton, DeleteButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css',
})
export class MemberPhotos implements OnInit {
  private readonly memberService = inject(MemberService);
  private readonly route = inject(ActivatedRoute);
  // private readonly photos$ = toSignal(this.memberService.getMemberPhotos(this.route.parent?.snapshot.paramMap.get("id") as string))
  private readonly destroy$ = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(Auth);

  protected isEditMode = computed(() => this.memberService.editProfile());
  protected photos = signal<Photo[]>([]);
  protected loading = signal<boolean>(false);
  protected member = computed(() => this.memberService.member());
  protected isCurrentUser = computed(
    () => this.authService.currentUser()?.id === this.member()?.id,
  );

  ngOnInit(): void {
    this.memberService
      .getMemberPhotos(this.route.parent?.snapshot.paramMap.get('id') as string)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((res) => {
        this.photos.set(res);
      });
  }

  get mockPhotos() {
    return Array.from({ length: 20 }, (_, i) => ({
      url: '/user.png',
    }));
  }

  onUploadImage(file: File) {
    this.loading.set(true);
    this.memberService
      .uploadPhoto(file)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.memberService.editProfile.set(false);
          this.photos.update((prev) => [...prev, response as Photo]);
          if (this.authService.currentUser()?.imageUrl === null) {
            this.setProfileAndUserImage(response as Photo);
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.toastService.error(error);
        },
      });
  }

  setMainPhoto(photo: Photo) {
    this.memberService
      .setMainPhoto(photo.id)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => {
        this.setProfileAndUserImage(photo);
      });
  }

  onDeletePhoto(photoId: number) {
    this.memberService
      .deleteMemberPhoto(photoId)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe(() => {
        this.photos.update((prev) => prev.filter((photo) => photo.id !== photoId));
      });
  }

  private setProfileAndUserImage(photo: Photo) {
    this.memberService.member.update((prev) => {
      if (!prev) {
        return null;
      }

      return {
        ...prev,
        imageUrl: photo.url,
      };
    });
    const currentUser = this.authService.currentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        imageUrl: photo.url,
      };
      this.authService.currentUser.update((prev) => updatedUser);
      this.authService.setCurrentUser(updatedUser);
    }
  }
}
