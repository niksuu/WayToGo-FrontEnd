import {Component} from '@angular/core';
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgForOf} from "@angular/common";
import {RouteItemComponent} from "./route-item/route-item.component";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MapLocation} from "../../map-location/map-location.model";
import {MapLocationService} from "../../map-location/map-location.service";
import {MapService} from "../../shared/map/map.service";
import {maxPageSize} from "../../shared/http.config";



@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css'
})
export class RouteListComponent {
  routes: Route[] = [];
  constructor(private routeService: RouteService, private mapLocationService: MapLocationService,
              private mapService: MapService) {}
  ngOnInit() {
    this.routeService.getRoutes(0, maxPageSize).subscribe(response => {
      this.routes = response.content;
    });

  }

  onRouteClick(routeIt: Route) {
    let mapLocations: MapLocation[] = [];
    this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, routeIt).subscribe( response => {
      mapLocations.push(...response.content);
      this.mapService.routeSelectedEventEmitter.emit(mapLocations);
    });
  }
}
