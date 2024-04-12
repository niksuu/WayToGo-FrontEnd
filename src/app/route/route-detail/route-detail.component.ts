import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterLinkActive} from "@angular/router";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {NgForOf, NgIf} from "@angular/common";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {MapLocationService} from "../../map-location/map-location.service";
import {maxPageSize} from "../../shared/http.config";

@Component({
  selector: 'app-route-detail',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouteItemComponent,
    RouterLinkActive
  ],
  templateUrl: './route-detail.component.html',
  styleUrl: './route-detail.component.css'
})
export class RouteDetailComponent implements OnInit{
  routeId: string;
  route: Route;
  mapLocationsNo: number;
  constructor(private activatedRoute: ActivatedRoute, private routeService: RouteService,
              private mapLocationService: MapLocationService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe (
      (params: Params) => {
        this.routeId = params['id'];
        this.routeService.getRouteById(this.routeId).subscribe(response => {
          this.route = response;

          //after fetching route, fetch its mapLocations
          this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
            .subscribe( response => {
              this.mapLocationsNo = response.content.length;
            });
        });
      }
    );
  }
}
