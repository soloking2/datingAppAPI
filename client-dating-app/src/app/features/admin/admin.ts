import { Component, computed, inject, signal } from '@angular/core';
import { Tab } from '../../core/interfaces/pagination';
import { Auth } from '../../auth/services/auth';
import { UserManagement } from "./user-management/user-management";
import { PhotoManagement } from "./photo-management/photo-management";

@Component({
  selector: 'dating-admin',
  imports: [UserManagement, PhotoManagement],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private readonly authService = inject(Auth);
  protected hasAdminRole = computed(() => this.authService.currentUser()?.roles?.includes('Admin'));
  tabs = signal<Tab[]>([
    {
      label: 'Photo Moderation',
      value: 'photos',
    },
    {
      label: 'User Management',
      value: 'roles',
    },
  ]);
  activeTab = signal<string>('photos');

  setActiveTab(tab: string) {
    if (this.activeTab() === tab) return;
    this.activeTab.set(tab);
  }
}
