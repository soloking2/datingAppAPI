import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Nav } from "./layout/nav/nav";
import { Auth } from './auth/services/auth';
import { LocalStorage } from './core/services/local-storage';
import { User } from './core/interfaces/User';
import { Home } from './features/home/home';

interface IMember {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  imports: [Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit{
  private readonly http = inject(HttpClient);
  private readonly authService = inject(Auth);
  private readonly storageService = inject(LocalStorage);
  protected readonly title = signal('Client App');
  private readonly membersOb = toSignal(this.http.get('https://localhost:5001/api/members'));
  protected members = computed(() => this.membersOb() as IMember[]);

  ngOnInit() {
    this.setCurrentUser();
  }

  private setCurrentUser() {
    const user = this.storageService.getItem('user');
    if(user) {
      this.authService.currentUser.set(user as User);
    }
  }
}
