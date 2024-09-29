import {AfterViewInit, Component, HostListener, ViewChild} from '@angular/core';
import {RouterModule} from "@angular/router";
import {HeaderComponent} from "./header/header.component";
import {ScreenSizeService} from "./shared/screen-size.service";
import {ConfirmationDialogComponent} from "./shared/confirmation-dialog/confirmation-dialog.component";
import {ConfirmationDialogService} from "./shared/confirmation-dialog/confirmation-dialog.service";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule, HeaderComponent, ConfirmationDialogComponent]
})
export class AppComponent implements AfterViewInit {
  @ViewChild(ConfirmationDialogComponent) confirmationDialog!: ConfirmationDialogComponent;
  title = 'WayToGo-FrontEnd';

  mobileBoundary = 800;

  constructor(private screenSizeService: ScreenSizeService, private confirmationDialogService: ConfirmationDialogService) {
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.screenSizeService.mobileVersion.next(window.innerWidth < this.mobileBoundary)

  }
  ngAfterViewInit() {
    this.confirmationDialogService.setDialogComponent(this.confirmationDialog);
  }
}
