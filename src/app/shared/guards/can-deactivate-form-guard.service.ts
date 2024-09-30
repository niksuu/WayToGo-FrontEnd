import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import {RouteEditComponent} from "../../route/route-edit/route-edit.component";

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateFormGuardService implements CanDeactivate<RouteEditComponent> {
  canDeactivate(
    component: RouteEditComponent
  ): Observable<boolean> | boolean {
    // Check if the form is dirty (meaning it has unsaved changes)
    if (component.routeForm.dirty && !component.routeForm.pristine) {
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;  // No unsaved changes, allow the navigation
  }
}
