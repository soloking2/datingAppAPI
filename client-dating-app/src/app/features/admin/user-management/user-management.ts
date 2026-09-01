import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AdminService } from '../services/admin-service';
import { User } from '../../../core/interfaces/User';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'dating-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  @ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
  private readonly adminService = inject(AdminService);
  private readonly destroy$ = inject(DestroyRef);

  protected userWithRoles = signal<User[]>([]);

  public availableRoles = signal<string[]>(['Admin', 'Moderator', 'Member']);
  public selectedUser = signal<User | null>(null);

  ngOnInit() {
    this.loadUsersWithRoles();
  }

  loadUsersWithRoles() {
    this.adminService
      .getUserWithRoles()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (response) => {
          this.userWithRoles.set(response);
        },
      });
  }

  openModal(user: User) {
    this.selectedUser.set(user);
    this.rolesModal.nativeElement.showModal();
  }

  close() {
    this.rolesModal.nativeElement.close();
  }

  toggleRole(event: Event, role: string) {
    if (!this.selectedUser()) return;
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedUser()?.role?.push(role);
    } else {
      this.selectedUser.update((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          role: prev.role?.filter((r) => r !== role),
        };
      });
    }
  }

  updateRoles() {
    if (!this.selectedUser()) return;
    this.adminService
      .editUserRole(this.selectedUser()!.id, this.selectedUser()!.role!.join(','))
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (updatedRoles) => {
          this.userWithRoles.update((users) =>
            users.map((user) => {
              if (user.id === this.selectedUser()?.id) user.role = updatedRoles;
              return user;
            }),
          );
          this.close();
        },
        error: (error) => {
          console.error('Failed to update roles', error);
        },
      });
  }
}
