import { Service } from '@angular/core';

@Service()
export class ToastService {
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

  private createToastElement(message: string, alertClass: string, duration = 5000) {
    if (!document.getElementById('toast-container')) return;
    const toastContainer = document.getElementById('toast-container');
    const toastElement = document.createElement('div');
    toastElement.classList.add('alert', alertClass, 'shadow-lg');
    toastElement.role = `${alertClass === 'alert-error' ? 'alert' : ''} `;
    toastElement.innerHTML = `
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

  success(message: string, duration?: number) {
    this.createToastElement(message, 'alert-success', duration);
  }
  error(message: string, duration?: number) {
    this.createToastElement(message, 'alert-error', duration);
  }
  warning(message: string, duration?: number) {
    this.createToastElement(message, 'alert-warning', duration);
  }
  info(message: string, duration?: number) {
    this.createToastElement(message, 'alert-info', duration);
  }
}
