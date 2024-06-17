import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MapLocation} from "../map-location.model";
import {NgForOf, NgIf} from "@angular/common";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {MapService} from "../../shared/map/map.service";
import {MapLocationService} from "../map-location.service";

@Component({
  selector: 'app-map-location-info-window',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './map-location-info-window.component.html',
  styleUrl: './map-location-info-window.component.css'
})
export class MapLocationInfoWindowComponent implements OnInit, OnChanges {

  @Input() mapLocation: MapLocation;
  imageUrl: SafeUrl = null;


  constructor( private sanitizer: DomSanitizer,
               private mapService: MapService,
               private mapLocationService: MapLocationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.imageUrl = null;

    this.mapLocationService.getMapLocationImageById(this.mapLocation.id).subscribe({
      next: (response: Blob | null) => {
        if (response) {
          //convert Blob (raw byte object) to url to display it in the template
          const objectURL = URL.createObjectURL(response);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }
      },
      error: (error: any) => {
        //
      }
    });

  }


  ngOnInit(): void {

  }

  onDetailsClick() {
    this.mapService.mapLocationDetailsEventEmitter.emit(this.mapLocation);
  }
}
