import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params, RouterLinkActive} from "@angular/router";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {MapLocationService} from "../../map-location/map-location.service";
import {maxPageSize} from "../../shared/http.config";
import {MapService} from "../../shared/map/map.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {RouteDetailService} from "./route-detail.service";


@Component({
  selector: 'app-route-detail',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    NgClass
  ],
  templateUrl: './route-detail.component.html',
  styleUrl: './route-detail.component.css'
})
export class RouteDetailComponent implements OnInit, OnDestroy{


  routeId: string;
  route: Route;
  routeImage: SafeUrl = null;
  mapLocationsNo: number;
  toggleRouteDetails: boolean;
  detailsButtonTxt: string = "";
  constructor(private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private routeService: RouteService,
              private mapLocationService: MapLocationService, private mapService: MapService,
              private routeDetailService: RouteDetailService) {
    this.toggleRouteDetails = false;
  }

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

          this.detailsButtonTxt = this.route.name + " | details";

          //after fetching route, fetch its mapLocations
          this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
            .subscribe( response => {
              //notify map to place markers
              //this.mapService.routeSelectedEventEmitter.emit(response.content);
              //  (this was found to be redundant (route list notifies map about clicked routes)
              //  but was left commented for future testing)
              this.mapLocationsNo = response.content.length;
            });
        });
      }
    );
  }

  onToggleRouteDetails() {
    this.toggleRouteDetails = ! this.toggleRouteDetails;
    this.routeDetailService.showRouteDetails.emit(this.toggleRouteDetails);

    this.detailsButtonTxt = this.toggleRouteDetails ?  "hide details" : this.route.name + " | details";
  }

  ngOnDestroy() {
    this.routeDetailService.showRouteDetails.emit(false);
    this.mapService.clearAllMarkers.emit();
  }

}
