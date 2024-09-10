import {Component, OnInit} from '@angular/core';
import {GoogleMap, GoogleMapsModule, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {CommonModule, NgForOf} from "@angular/common";
import {PointSelectMapService} from "./point-select-map.service";

@Component({
  selector: 'app-point-select-map',
  standalone: true,
  imports: [
    GoogleMap,
    MapInfoWindow,
    MapMarker,
    NgForOf,
    GoogleMapsModule,
    CommonModule
  ],
  templateUrl: './point-select-map.component.html',
  styleUrl: './point-select-map.component.css'
})
export class PointSelectMapComponent implements OnInit{
  cursorLatLng: google.maps.LatLngLiteral | undefined;
  center: google.maps.LatLngLiteral = {
    lat: 53.69671,
    lng: 19.96486
  };
  zoom = 14;

  //all markers' options
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  //selected route's markers positions
  markerPosition: google.maps.LatLngLiteral;
  centerSet = false;

  constructor(private mapSerivce: PointSelectMapService) {
  }



  ngOnInit() {
    this.mapSerivce.markerSelectedEmitter.subscribe(position => {
      this.markerPosition = { lat: position.lat, lng: position.lng };

      if (!this.centerSet) {
        this.center = this.markerPosition;
        this.centerSet = true;
      }
    });

  }

  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    if ($event.latLng) {
      this.addMarker($event.latLng.toJSON());
    }
  }

  addMarker(latLng: google.maps.LatLngLiteral) {
    this.markerPosition = latLng;
    this.mapSerivce.markerSelectedEmitter.next({lat: this.markerPosition.lat, lng: this.markerPosition.lng});
  }

  onMapMousemove(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.getCursorLatLng(event);
    }
  }

  getCursorLatLng(event: google.maps.MapMouseEvent) {
    this.cursorLatLng = event.latLng ? event.latLng.toJSON() : undefined;
  }

}
