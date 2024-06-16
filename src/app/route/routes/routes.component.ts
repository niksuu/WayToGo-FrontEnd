import {Component, HostListener, OnInit} from '@angular/core';
import {MapComponent} from "../../shared/map/map.component";
import {CommonModule} from "@angular/common";
import {RouteListComponent} from "../route-list/route-list.component";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {RouterOutlet} from "@angular/router";
import {SidePanelService} from "../../shared/side-panel.service";
import {MapService} from "../../shared/map/map.service";
import {ScreenSizeService} from "../../shared/screen-size.service";


@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [MapComponent, CommonModule, RouteItemComponent, RouteListComponent, RouterOutlet],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.css'
})
export class RoutesComponent implements OnInit {

  toggleSidePanel = true;
  panelButtonContent: string = "";

  mobileVersion: boolean;

  constructor(private sidePanelService: SidePanelService, private mapService: MapService, private screenSizeService: ScreenSizeService) {

  }

  onToggleSidePanel() {
    this.toggleSidePanel = !this.toggleSidePanel;
    this.panelButtonContent = this.toggleSidePanel ? "" : "Route";

    if(this.mobileVersion) {
      this.mapService.closeInfoWindow.emit();
    }

  }

  ngOnInit(): void {

    this.screenSizeService.isMobileVersion$.subscribe(isMobileVersion => {
      this.mobileVersion = isMobileVersion;
    });

    this.toggleSidePanel = true;
    this.sidePanelService.togglePanelEventEmitter.subscribe(toggle => {


        this.toggleSidePanel = toggle;
        this.panelButtonContent = toggle ? "" : "Route";

        if(this.mobileVersion) {
          this.mapService.closeInfoWindow.emit();
        }


    })
  }
}
