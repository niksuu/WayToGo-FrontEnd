import {HostListener, Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ScreenSizeService {


  mobileVersion = new BehaviorSubject<boolean>(false);
  isMobileVersion$ = this.mobileVersion.asObservable();
  private  mobileBoundary = 800;

  constructor() {
    this.mobileVersion.next(window.innerWidth < this.mobileBoundary);
  }

}
