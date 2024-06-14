import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLinkActive} from "@angular/router";
import {RouteService} from "../route.service";
import {Route} from "../route.model";
import {NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {RouteItemComponent} from "../route-list/route-item/route-item.component";
import {MapLocationService} from "../../map-location/map-location.service";
import {maxPageSize} from "../../shared/http.config";
import {MapService} from "../../shared/map/map.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {Location} from '@angular/common';
import {MapLocationListComponent} from "../../map-location/map-location-list/map-location-list.component";


@Component({
  selector: 'app-route-detail',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouteItemComponent,
    RouterLinkActive,
    NgClass,
    MapLocationListComponent
  ],
  templateUrl: './route-detail.component.html',
  styleUrl: './route-detail.component.css'
})
export class RouteDetailComponent implements OnInit, OnDestroy {


  routeId: string;
  route: Route;
  routeImage: SafeUrl = null;

  constructor(private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private routeService: RouteService,
              private mapService: MapService, private location: Location) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.routeId = params['id'];
        this.routeService.getRouteById(this.routeId).subscribe(response => {
          this.route = response;

          this.routeService.getRouteImageById(this.routeId).subscribe({
            next: (response: Blob | null) => {
              if (response) {
                //convert Blob (raw byte object) to url to display it in the template
                const objectURL = URL.createObjectURL(response);
                this.routeImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
              }
            },
            error: (error: any) => {
              this.routeImage = null;
            }
          });
        });
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy() {
    this.mapService.clearAllMarkers.emit();
  }

}
