import {Component, OnInit, OnDestroy, ViewChild, HostListener, AfterViewInit} from '@angular/core';
import { GoogleMapsModule, MapInfoWindow, MapMarker, MapDirectionsRenderer } from "@angular/google-maps";
import { CommonModule } from "@angular/common";
import { MapService } from "./map.service";
import { MapLocation } from "../../map-location/map-location.model";
import { MapLocationService } from "../../map-location/map-location.service";
import { Router, NavigationEnd } from '@angular/router';
import {
  MapLocationInfoWindowComponent
} from "../../map-location/map-location-info-window/map-location-info-window.component";
import {SidePanelService} from "../side-panel.service";
import {ScreenSizeService} from "../screen-size.service";

//google maps api documentation
//https://developers.google.com/maps/documentation/javascript

//configuration for future
//https://medium.com/swlh/angular-google-map-component-basics-and-tips-7ff679e383ff


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, MapLocationInfoWindowComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit,AfterViewInit ,OnDestroy {

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
  @ViewChild('map', { static: false }) map: any;

  mobileVersion: boolean;


  infoWindowMapLocation: MapLocation = null;

  userMarker: google.maps.Marker | undefined;
  locationTrackingInterval: any;

  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(
    private sidePanelService: SidePanelService,
    private mapService: MapService,
    private mapLocationService: MapLocationService,
    private router: Router,
    private screenSizeService: ScreenSizeService
  ) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
  }

  ngOnInit(): void {

    this.screenSizeService.isMobileVersion$.subscribe(isMobileVersion => {
      this.mobileVersion = isMobileVersion;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.router.url === '/routes/list') {
          this.focusOnCurrentLocation();
        }
      }
    });

    this.mapService.routeSelectedEventEmitter.subscribe(mapLocations => {
      this.handleRouteSelected(mapLocations);
    });

    this.mapService.mapLocationDetailsEventEmitter.subscribe(mapLocation =>{
      let trace: google.maps.LatLngLiteral = {
        lat: mapLocation.coordinates.coordinates[0],
        lng: mapLocation.coordinates.coordinates[1]
      };
      this.calculateRoute(trace)
    })

    this.mapService.closeInfoWindow.subscribe(()=> {
      if(this.infoWindow != undefined) {
        this.infoWindow.close();
      }
    })

    this.mapService.clearAllMarkers.subscribe(() => {
      this.markerPositions = [];
    });

    this.getCurrentLocation(true); // Center map initially
    this.startLocationTracking();

    this.mapService.centerOnMapLocation.subscribe(mapLocation => {
        let center: google.maps.LatLngLiteral = {
          lat: mapLocation.coordinates.coordinates[0],
          lng: mapLocation.coordinates.coordinates[1]
        };
        this.setCenter(center);


    })

  }


  ngAfterViewInit(): void {
    // Upewnij się, że mapa jest gotowa i przypisz renderer
    if (this.map && this.map.googleMap) {
      this.directionsRenderer.setMap(this.map.googleMap);
    } else {
      console.error('Mapa nie jest gotowa, sprawdź inicjalizację mapy.');
    }
  }



  onCalculateRoute(mapLocation: MapLocation) {
    if (this.userMarker) {
      const destination = {
        lat: mapLocation.coordinates.coordinates[0],
        lng: mapLocation.coordinates.coordinates[1]
      };
      this.calculateRoute(destination);
    } else {
      console.error('Brak lokalizacji użytkownika.');
    }
  }


  calculateRoute(destination: google.maps.LatLngLiteral) {
    if (this.directionsService && this.map && this.map.googleMap) {
      const start = { lat: this.userMarker.getPosition().lat(), lng: this.userMarker.getPosition().lng() };

      this.directionsService.route(
        {
          origin: start,
          destination: destination,
          travelMode: google.maps.TravelMode.WALKING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            this.directionsRenderer.setOptions({
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: "#0000FF",
                strokeOpacity: 0.5,
                strokeWeight: 4
              }
            });
            this.directionsRenderer.setDirections(response)

          } else {
            console.error('Błąd przy wyznaczaniu trasy: ' + status);
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.stopLocationTracking();
  }

  startLocationTracking() {
    this.locationTrackingInterval = setInterval(() => {
      this.getCurrentLocation(false); // Update location without centering
    }, 5000); // Aktualizacja co 5 sekund
  }

  stopLocationTracking() {
    if (this.locationTrackingInterval) {
      clearInterval(this.locationTrackingInterval);
    }
  }

  getCurrentLocation(centerMap: boolean) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const newCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (centerMap) {
          this.setCenter(newCenter);
        }
        this.updateUserMarker(newCenter);
      }, error => {
        console.error('Error getting location: ', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  updateUserMarker(position: google.maps.LatLngLiteral) {
    if (!this.userMarker) {
      this.userMarker = new google.maps.Marker({
        position,
        map: this.map.googleMap,
        icon: {
          url: 'https://cdn.prod.website-files.com/62c5e0898dea0b799c5f2210/62e8212acc540f291431bad2_location-icon.png', // Ikona z literą 'M'
          scaledSize: new google.maps.Size(40, 40) // Rozmiar ikony
        }
      });
    } else {
      this.userMarker.setPosition(position);
    }
  }

  focusOnCurrentLocation() {
    if (this.userMarker) {
      this.setCenter(this.userMarker.getPosition().toJSON());
    }
  }

  setCenter(centerLatLng: google.maps.LatLngLiteral) {
    this.center = centerLatLng;
    if (this.map) {
      this.map.panTo(new google.maps.LatLng(centerLatLng.lat, centerLatLng.lng));
    }
    this.zoom = 17;
  }

  onMapClick($event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {
    if(this.infoWindow != undefined) {
      this.infoWindow.close();
    }
  }

  onMapMousemove($event: google.maps.MapMouseEvent) {
    this.getCursorLatLng($event);
  }

  onMarkerClick(marker: MapMarker) {

    // Map location associated with clicked marker
    let markerMapLocation: MapLocation | null = null;
    // Search for appropriate map location
    for(let mapLocation of this.mapLocations) {
      if(mapLocation.coordinates.coordinates[0] == marker.getPosition().toJSON().lat
        && mapLocation.coordinates.coordinates[1] == marker.getPosition().toJSON().lng ) {
        markerMapLocation = mapLocation;
        break;
      }
    }


    // Populate info window
    if (markerMapLocation) {


      if(this.mobileVersion) {
        this.sidePanelService.togglePanelEventEmitter.emit(false);
      }


      this.infoWindowMapLocation = markerMapLocation

      if (this.infoWindow) {
        this.infoWindow.open(marker);
      }


    }

    if (markerMapLocation) {
      console.log("helo");
      const destination = {
        lat: markerMapLocation.coordinates.coordinates[0],
        lng: markerMapLocation.coordinates.coordinates[1],
      };

      this.calculateRoute(destination);  // Wywołanie funkcji wyznaczania trasy
    }

  }

  //helpers
  addMarker(latLng: google.maps.LatLngLiteral) {
    if (latLng != null) this.markerPositions.push(latLng);
  }

  //moves map so that the center is in the clicked point
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.setCenter(event.latLng.toJSON());
  }

  //fetches the current cursor's coordinates
  getCursorLatLng(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.cursorLatLng = event.latLng.toJSON();
  }

  handleRouteSelected(mapLocations: MapLocation[]) {
    // Save selected route's map locations
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
    this.setCenter(this.markerPositions[0]);
  }
}
