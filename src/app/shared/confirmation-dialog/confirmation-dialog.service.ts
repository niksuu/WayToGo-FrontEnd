import { Injectable } from '@angular/core';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private dialogComponent!: ConfirmationDialogComponent;
  private confirmationResult = new Subject<boolean>();

  setDialogComponent(component: ConfirmationDialogComponent) {
    this.dialogComponent = component;
  }

  confirm(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel') {
    this.dialogComponent.show(title, message, confirmText, cancelText);
    return this.confirmationResult.asObservable();
  }

  confirmAction(result: boolean) {
    this.confirmationResult.next(result);
  }
}
