import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog-service';

@Component({
  selector: 'dating-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  @ViewChild('dialogRef') dialogRef!: ElementRef<HTMLDialogElement>;
  protected message!: string;
  resolve: ((resolved: boolean) => void) | null = null;

  constructor() {
    inject(ConfirmDialogService).register(this);
  }


  open(message = "Are you sure?"): Promise<boolean> {
    this.message = message;
    this.dialogRef.nativeElement.showModal();
    return new Promise((resolve) => (this.resolve = resolve));
  }

  confirm() {
    this.resolve?.(true);
    this.resolve = null;
    this.dialogRef?.nativeElement.close();
  }

  cancel() {
    this.dialogRef?.nativeElement.close();
    this.resolve?.(false);
    this.resolve = null;
  }
}
