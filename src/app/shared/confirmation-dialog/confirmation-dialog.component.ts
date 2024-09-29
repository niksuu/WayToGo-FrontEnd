import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {ConfirmationDialogService} from "./confirmation-dialog.service";

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css'
})
export class ConfirmationDialogComponent {
  title: string = '';
  message: string = '';
  confirmText: string = 'Confirm';
  cancelText: string = 'Cancel';
  isVisible: boolean = false;

  constructor(private confirmationService: ConfirmationDialogService) {}

  show(title: string, message: string, confirmText: string = 'Confirm', cancelText: string = 'Cancel') {
    this.title = title;
    this.message = message;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.isVisible = true;
  }

  confirm() {
    this.confirmationService.confirmAction(true);
    this.close();
  }

  cancel() {
    this.confirmationService.confirmAction(false);
    this.close();
  }

  close() {
    this.isVisible = false;
  }
}
