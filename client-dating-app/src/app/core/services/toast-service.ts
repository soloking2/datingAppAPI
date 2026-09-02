import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class ToastService {
  private readonly router = inject(Router);
  constructor() {
    this.createToastContainer();
  }

  private createToastContainer() {
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast toast-bottom toast-end';
      document.body.appendChild(toastContainer);
    }
  }

  private createToastElement(
    message: string,
    alertClass: string,
    duration = 5000,
    avatar?: string,
    route?: string,
  ) {
    if (!document.getElementById('toast-container')) return;
    const toastContainer = document.getElementById('toast-container');
    const toastElement = document.createElement('div');
    toastElement.classList.add(
      'alert',
      alertClass,
      'shadow-lg',
      'flex',
      'items-center',
      'gap-3',
      'cursor-pointer',
    );
    toastElement.role = `${alertClass === 'alert-error' ? 'alert' : ''} `;

    if (route) {
      console.log(route);
      toastContainer?.addEventListener('click', () => {
        this.router.navigateByUrl(route);
      });
    }
    toastElement.innerHTML = `
    ${avatar ? `<img src=${avatar || '/user.png'} class='w-10 h-10 rounded'/>` : ''}
    <span class="text-white">${message} </span>
    <button class="ml-4 btn btn-sm btn-ghost">X</button>
    `;

    toastElement.querySelector('button')?.addEventListener('click', () => {
      toastElement.remove();
    });

    toastContainer?.append(toastElement);

    setTimeout(() => {
      if (toastContainer?.contains(toastElement)) {
        toastElement.remove();
      }
    }, duration);
  }

  success(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-success', duration, avatar, route);
  }
  error(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-error', duration, avatar, route);
  }
  warning(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-warning', duration, avatar, route);
  }
  info(message: string, duration?: number, avatar?: string, route?: string) {
    this.createToastElement(message, 'alert-info', duration, avatar, route);
  }
}
