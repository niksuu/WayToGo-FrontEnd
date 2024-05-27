import {Component, OnInit, ViewChild} from '@angular/core';
import {GoogleMapsModule, MapInfoWindow, MapMarker} from "@angular/google-maps";
import {CommonModule} from "@angular/common";
import {MapService} from "./map.service";
import {MapLocation} from "../../map-location/map-location.model";
import {MapLocationService} from "../../map-location/map-location.service";

//google maps api documentation
//https://developers.google.com/maps/documentation/javascript

//configuration for future
//https://medium.com/swlh/angular-google-map-component-basics-and-tips-7ff679e383ff

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

  //all markers' options
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  //selected route's markers positions
  markerPositions: google.maps.LatLngLiteral[] = [];
  //selected route's map locations
  mapLocations: MapLocation[] = [];

  //info window visible after selecting a marker
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  infoWindowText: string = '';
  infoWindowMapLocationId : string = '';
  infoWindowMapLocationName : string = '';
  infoWindowMapLocationDescription : string = '';

  constructor(private mapService: MapService, private mapLocationService: MapLocationService) {}

  ngOnInit(): void {
    this.mapService.routeSelectedEventEmitter.subscribe(mapLocations => {
      this.handleRouteSelected(mapLocations);
    });

    this.mapService.clearAllMarkers.subscribe( () => {
      this.markerPositions = [];
    })

    this.getCurrentLocation();
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.addMarker(this.center);
      }, error => {
        console.error('Error getting location: ', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    //this.moveMap($event);

    //adding new points (can be used later for adding points)
    //this.addMarker($event.latLng.toJSON());
    if(this.infoWindow != undefined)
      this.infoWindow.close();
  }

  onMapMousemove($event: google.maps.MapMouseEvent) {
    this.getCursorLatLng($event);
  }

  onMarkerClick(marker: MapMarker) {
    ///map location associated with clicked marker
    let markerMapLocation: MapLocation = null;
    //search for appropriate map location
    for(let mapLocation of this.mapLocations) {
      if(mapLocation.coordinates.coordinates[0] == marker.getPosition().toJSON().lat
        && mapLocation.coordinates.coordinates[1] == marker.getPosition().toJSON().lng ) {
        markerMapLocation = mapLocation;
        break;
      }
    }
    //populate info window
    this.infoWindowText = marker.getPosition().toString() + markerMapLocation.id + markerMapLocation.description;
    this.infoWindowMapLocationName = markerMapLocation.name;
    this.infoWindowMapLocationId = markerMapLocation.id;
    this.infoWindowMapLocationDescription = markerMapLocation.description;
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

  setCenter(centerLatLng:  google.maps.LatLngLiteral) {
    this.center = centerLatLng;
  }

  //fetches the current cursor's coordinates
  getCursorLatLng(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.cursorLatLng = event.latLng.toJSON();
  }

  handleRouteSelected(mapLocations) {
    //save selected route's map locations
    this.mapLocations = mapLocations;

    //reset map markers positions
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

    //set center to the first mapLocation
    let centerLatLong: google.maps.LatLngLiteral = {
      lat: mapLocations[0].coordinates.coordinates[0],
      lng: mapLocations[0].coordinates.coordinates[1] - 0.01
    };
    this.setCenter(centerLatLong);
  }
}
