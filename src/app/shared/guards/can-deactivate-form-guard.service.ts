import {Injectable} from "@angular/core";
import {ConfirmationDialogService} from "../confirmation-dialog/confirmation-dialog.service";

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateFormGuardService {

  constructor(private confirmationDialogService: ConfirmationDialogService) {}

  canDeactivateForm(isDirty: boolean):Promise<boolean> {
    if (isDirty) {
      return new Promise((resolve) => {
        this.confirmationDialogService
          .confirm(
            'Confirm Exiting',
            `You are about to exit without saving the changes. Do you want to proceed?`,
            'Yes',
            'Cancel'
          )
          .subscribe((confirmed: boolean) => {
            resolve(confirmed);
          });
      });
    } else {
      return Promise.resolve(true);
    }
  }
}
