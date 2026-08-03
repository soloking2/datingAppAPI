import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

interface IMember {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly http = inject(HttpClient);
  protected readonly title = signal('Client App');
  private readonly membersOb = toSignal(this.http.get('https://localhost:5001/api/members'));
  protected members = computed(() => this.membersOb() as IMember[]);
}
