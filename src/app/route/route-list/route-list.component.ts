import {Component} from '@angular/core';
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgForOf} from "@angular/common";
import {RouteItemComponent} from "./route-item/route-item.component";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MapLocation} from "../../map-location/map-location.model";
import {MapLocationService} from "../../map-location/map-location.service";
import {MapService} from "../../shared/map/map.service";
import {defaultPageSize, maxPageSize} from "../../shared/http.config";


@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './route-list.component.html',
  styleUrl: './route-list.component.css'
})
export class RouteListComponent {
  routes: Route[] = [];
  currentPageNumber: number;
  totalPages: number;

  constructor(private routeService: RouteService, private mapLocationService: MapLocationService,
              private mapService: MapService) {
  }

  ngOnInit() {
    this.currentPageNumber = 1;
    this.getRoutes();

  }

  onRouteClick(routeIt: Route) {
    let mapLocations: MapLocation[] = [];
    this.mapLocationService.getMapLocationsByRoute(1, defaultPageSize, routeIt.id).subscribe(response => {
      mapLocations.push(...response.content);
      this.mapService.routeSelectedEventEmitter.emit(mapLocations);
    });
  }

  onPrevPage() {
    if (this.currentPageNumber > 1) {
      this.currentPageNumber--;
      this.getRoutes();
    }
  }

  onNextPage() {
    if (this.currentPageNumber < this.totalPages) {
      this.currentPageNumber++;
      this.getRoutes();
    }
  }

  showCurrentPageNumber() {
    let pageNumberString = '';
    if (this.currentPageNumber > 2) {
      pageNumberString += '... ';
    }
    if (this.currentPageNumber > 1) {
      pageNumberString += (this.currentPageNumber - 1) + ' ';
    }
    //pageNumberString += this.currentPageNumber;
    pageNumberString += `<span class="text-primary"><strong>${this.currentPageNumber}</strong></span>`;
    if (this.currentPageNumber <= this.totalPages - 1) {
      pageNumberString += ' ' + (this.currentPageNumber + 1) + ' ';
    }
    if (this.currentPageNumber <= this.totalPages - 2) {
      pageNumberString += '... ';
    }
    return pageNumberString;
  }

  getRoutes() {
    this.routeService.getRoutes(this.currentPageNumber, defaultPageSize).subscribe(response => {
      this.routes = response.content;
      this.totalPages = response.totalPages;
    });
  }
}
