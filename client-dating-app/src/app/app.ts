
import { Component, inject } from '@angular/core';
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
  protected router = inject(Router);


}
