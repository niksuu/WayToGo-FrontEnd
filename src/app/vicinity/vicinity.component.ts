import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SidePanelService} from "../shared/side-panel.service";
import {MapService} from "../shared/map/map.service";
import {ScreenSizeService} from "../shared/screen-size.service";
import {MapComponent} from "../shared/map/map.component";
import {CommonModule, NgIf} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MapLocationService} from "../map-location/map-location.service";

@Component({
  selector: 'app-vicinity',
  standalone: true,
  imports: [
    MapComponent,
    NgIf,
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './vicinity.component.html',
  styleUrl: './vicinity.component.css'
})
export class VicinityComponent implements  OnInit{
  toggleSidePanel = true;
  panelButtonContent: string = "";

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  mobileVersion: boolean;

  range: number = 30;

  constructor(private sidePanelService: SidePanelService, private mapService: MapService, private screenSizeService: ScreenSizeService,private mapLocationService: MapLocationService) {

  }
  onSubmit() {
    this.mapService.clearAllMarkers.emit()
    this.mapComponent.getCurrentLocationPromise().then(point => {
      if (point) {
        const { lat, lng } = point;
        this.mapLocationService.getMapLocationsByRange(lat, lng, this.range * 1000).subscribe(
          locations => {
            this.mapComponent.setMapLocationsAndMarkers(locations)
          }
        );
      } else {
        console.error("No coordinates");
      }
    }).catch(error => {
      console.error("Error: ", error);
    });
  }

  onToggleSidePanel() {
    this.toggleSidePanel = !this.toggleSidePanel;
    this.panelButtonContent = this.toggleSidePanel ? "" : "Vicnity";

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
      this.panelButtonContent = toggle ? "" : "Vicnity";

      if(this.mobileVersion) {
        this.mapService.closeInfoWindow.emit();
      }
    })
    const point =  this.mapComponent.getCurrentLocationPromise()
  }
  // ngOnDestroy() {
  //   this.mapService.clearAllMarkers.emit();
  // }
}
