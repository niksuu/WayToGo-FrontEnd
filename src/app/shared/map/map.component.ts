import {Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsModule, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {CommonModule} from "@angular/common";
import {MapService} from "./map.service";
import {MapLocation} from "../../map-location/map-location.model";
import {MapLocationService} from "../../map-location/map-location.service";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{

  cursorLatLng: google.maps.LatLngLiteral | undefined;
  center: google.maps.LatLngLiteral = {
    lat: 53.69671,
    lng: 19.96486
  };
  zoom = 14;

  //markers
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  infoWindowText: string = '';


  constructor(private mapService: MapService) {}
  ngOnInit(): void {
    this.mapService.routeSelectedEventEmitter.subscribe(mapLocations => {
      this.handleRouteSelected(mapLocations);
    });
  }



  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    //this.moveMap($event);
    this.addMarker($event.latLng.toJSON());
  }

  onMapMousemove($event: google.maps.MapMouseEvent) {
    this.getCursorLatLng($event);

  }

  onMarkerClick(marker: MapMarker) {
    this.infoWindowText = (marker.getPosition() ?? '').toString();
    if (this.infoWindow != undefined) this.infoWindow.open(marker);
  }

  //helpers
  addMarker(latLng: google.maps.LatLngLiteral) {
    if (latLng != null) this.markerPositions.push(latLng);
  }

  //moves map so that the center is in the clicked point
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
  }

  //fetches the current cursor's coordinates
  getCursorLatLng(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.cursorLatLng = event.latLng.toJSON();
  }

  handleRouteSelected(mapLocations) {
    this.markerPositions = [];
    if(mapLocations.length == 0) {
      return;
    }
    for(let mapLocation of mapLocations) {
      let newMarkerLatLng: google.maps.LatLngLiteral = {
        lat: mapLocation.coordinates.coordinates[0],
        lng: mapLocation.coordinates.coordinates[1]
      };
      this.addMarker(newMarkerLatLng);
    }
  }


}
