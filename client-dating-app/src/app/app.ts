
import { Component, inject, OnInit } from '@angular/core';
import { Nav } from './layout/nav/nav';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LikesService } from './features/members/services/likes-service';

@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected router = inject(Router);
  private readonly likeService = inject(LikesService);


  ngOnInit(): void {
    this.likeService.getLikeIds();
  }


}
