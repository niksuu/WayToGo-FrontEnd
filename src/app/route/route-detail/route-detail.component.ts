import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLinkActive } from "@angular/router";
import { RouteService } from "../route.service";
import { Route } from "../route.model";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { RouteItemComponent } from "../route-list/route-item/route-item.component";
import { MapLocationService } from "../../map-location/map-location.service";
import { maxPageSize } from "../../shared/http.config";
import { MapService } from "../../shared/map/map.service";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Location } from '@angular/common';

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
export class RouteDetailComponent implements OnInit, OnDestroy {

  routeId: string;
  route: Route;
  routeImage: SafeUrl = null;
  mapLocationsNo: number;
  detailsButtonTxt: string = "";

  constructor(private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private routeService: RouteService,
              private mapLocationService: MapLocationService, private mapService: MapService, private location: Location) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.routeId = params['id'];
        this.routeService.getRouteById(this.routeId).subscribe(response => {
          this.route = response;

          this.routeService.getRouteImageById(this.routeId).subscribe({
            next: (response: Blob | null) => {
              if (response) {
                const objectURL = URL.createObjectURL(response);
                this.routeImage = this.sanitizer.bypassSecurityTrustUrl(objectURL);
                console.log('Image URL:', objectURL); // Debugging log
              } else {
                console.error('No image found for this route.');
                this.routeImage = null;
              }
            },
            error: (error: any) => {
              console.error('Error fetching image:', error);
              this.routeImage = null;
            }
          });

          this.detailsButtonTxt = this.route.name + " | details";

          this.mapLocationService.getMapLocationsByRoute(0, maxPageSize, this.route.id)
            .subscribe(response => {
              this.mapLocationsNo = response.content.length;
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
