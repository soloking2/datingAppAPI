import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Nav } from './layout/nav/nav';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

interface IMember {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly http = inject(HttpClient);
  protected router = inject(Router);
  protected readonly title = signal('Client App');
  private readonly membersOb = toSignal(this.http.get('https://localhost:5001/api/members'));
  protected members = computed(() => this.membersOb() as IMember[]);
}
