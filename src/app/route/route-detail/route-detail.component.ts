import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, RouterLinkActive} from "@angular/router";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {NgForOf, NgIf} from "@angular/common";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {MapLocationService} from "../../map-location/map-location.service";
import {maxPageSize} from "../../shared/http.config";
import {MapService} from "../../shared/map/map.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

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
  routeImage: SafeUrl = null;
  mapLocationsNo: number;
  ifShowRouteDetails: boolean;
  constructor(private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private routeService: RouteService,
              private mapLocationService: MapLocationService, private mapService: MapService) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe (
      (params: Params) => {
        this.routeId = params['id'];
        this.routeService.getRouteById(this.routeId).subscribe(response => {
          this.route = response;

          this.routeService.getRouteImageById(this.routeId).subscribe({
            next: (response: Blob | null) => {
              //convert Blob (raw byte object) to url to display it in the template
              const objectURL = URL.createObjectURL(response);
              this.routeImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            },
            error: (error: any) => {
              this.routeImage = null;
            }
          });


          //after fetching route, fetch its mapLocations
          this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
            .subscribe( response => {
              //notify map to place markers
              this.mapService.routeSelectedEventEmitter.emit(response.content);
              this.mapLocationsNo = response.content.length;
            });
        });
      }
    );
  }

  onShowRouteDetails() {
    this.ifShowRouteDetails = !this.ifShowRouteDetails;
  }
}
