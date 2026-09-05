import { Component, inject } from '@angular/core';
import { Nav } from './layout/nav/nav';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmDialog } from "./shared/components/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, CommonModule, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected router = inject(Router);


}
