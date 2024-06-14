import {EventEmitter, Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class SidePanelService {
  togglePanelEventEmitter = new EventEmitter<boolean>();
}
