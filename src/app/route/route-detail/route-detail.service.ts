import {EventEmitter, Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class RouteDetailService{
  routeDetailsClicked = new EventEmitter<void>();

  constructor() { }
}
