import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink, UrlTree} from "@angular/router";
import {defaultPageSize, maxPageSize} from "../../shared/http.config";
import {Route} from "../route.model";
import {RouteService} from "../route.service";
import {NgIf} from "@angular/common";
import {MapLocation} from "../../map-location/map-location.model";
import {MapLocationService} from "../../map-location/map-location.service";
import {MapService} from "../../shared/map/map.service";

@Component({
  selector: 'app-route-info',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './route-info.component.html',
  styleUrl: './route-info.component.css'
})
export class RouteInfoComponent  implements OnInit{

  routeId: string;
  route: Route;
  userMode: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private routeService: RouteService,
              private mapLocationService: MapLocationService,
              private mapService: MapService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe (
      (params: Params) => {
        this.routeId = params['id'];
        this.routeService.getRouteById(this.routeId).subscribe(response => {
          this.route = response;
        });

        this.mapLocationService.getMapLocationsByRoute(1, maxPageSize, this.routeId).subscribe(response => {
          this.mapService.routeSelectedEventEmitter.emit(response.content);
        });
      }
    );

    this.activatedRoute.url.subscribe(urlSegments => {
      const urlTree: UrlTree = this.router.parseUrl(this.router.url);
      this.userMode = urlTree.root.children['primary'].segments.some(segment => segment.path === 'yourRoutes');
    });

  }
}
