import {EventEmitter, Injectable} from "@angular/core";
import {MapLocation} from "../map-location.model";

@Injectable({providedIn: 'root'})
export class PointSelectMapService {
  markerSelectedEmitter = new EventEmitter<{lat: number, lng: number}>();

  setMarker(position: { lat: number, lng: number }) {
    this.markerSelectedEmitter.emit(position);
  }
}
