import {Component, HostListener} from '@angular/core';
import {RouterModule} from "@angular/router";
import {HeaderComponent} from "./header/header.component";
import {ScreenSizeService} from "./shared/screen-size.service";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, HeaderComponent]
})
export class AppComponent {
  title = 'WayToGo-FrontEnd';

  mobileBoundary = 800;

  constructor(private screenSizeService: ScreenSizeService) {
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSizeService.mobileVersion.next(window.innerWidth < this.mobileBoundary)

  }
}
