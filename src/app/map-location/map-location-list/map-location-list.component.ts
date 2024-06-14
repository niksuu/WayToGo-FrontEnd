import {Component, HostListener, Input, OnInit} from '@angular/core';
import {MapLocationService} from "../map-location.service";
import {maxPageSize} from "../../shared/http.config";
import {Route} from "../../route/route.model";
import {MapLocation} from "../map-location.model";
import {NgClass, NgForOf} from "@angular/common";
import {RouteItemComponent} from "../../route/route-list/route-item/route-item.component";
import {ActivatedRoute, Router, RouterLinkActive} from "@angular/router";
import {SidePanelService} from "../../shared/side-panel.service";
import {MapService} from "../../shared/map/map.service";

@Component({
  selector: 'app-map-location-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './map-location-list.component.html',
  styleUrl: './map-location-list.component.css'
})
export class MapLocationListComponent implements OnInit {

  @Input() route: Route;
  mapLocations: MapLocation[];
  activeMapLocationId: string;

  mobileVersion: boolean;
  mobileBoundary: number = 800;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.mobileVersion = window.innerWidth < this.mobileBoundary ? true : false;
  }

  constructor(private mapService: MapService, private sidePanelService: SidePanelService, private mapLocationService: MapLocationService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.mobileVersion = window.innerWidth < this.mobileBoundary ? true : false;

    this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
      .subscribe(response => {
        this.mapLocations = response.content;
        this.mapService.routeSelectedEventEmitter.emit(this.mapLocations);
      });


  }

  onMapLocationSelected(mapLocation: MapLocation) {
    this.activeMapLocationId = mapLocation.id;

    if (this.mobileVersion) {
      this.sidePanelService.togglePanelEventEmitter.emit(false);
    }
    this.mapService.centerOnMapLocation.emit(mapLocation);
  }

}
