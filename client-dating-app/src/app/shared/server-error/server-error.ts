import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IApiError } from '../../core/interfaces/error';

@Component({
  selector: 'dating-server-error',
  imports: [],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerError {
  private readonly router = inject(Router);
  protected location = inject(Location);
  protected error = signal<IApiError>({} as IApiError);
  protected showDetails = signal(false);

  constructor() {
    this.error = this.router.currentNavigation()?.extras?.state?.['errors'];
  }
}
