import { Service } from '@angular/core';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';

@Service()
export class ConfirmDialogService {
  private dialogComponent?: ConfirmDialog;

  register(component: ConfirmDialog) {
    this.dialogComponent = component;
  }



  open(message = 'Are you sure?') {
     if (!this.dialogComponent) {
       throw new Error('There is no dialog component present to use');
     }
     return this.dialogComponent.open(message);
  }
}
