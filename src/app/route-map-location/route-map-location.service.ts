import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { backendUrl } from "../shared/http.config";
import {Observable, switchMap, throwError} from "rxjs";
import { map } from "rxjs/operators";
import {MapLocationConflictError} from "../shared/errors/route-map-location-conflict.error";

@Injectable({ providedIn: 'root' })
export class RouteMapLocationService {

  constructor(private http: HttpClient) {}

  postRouteMapLocation(routeId: string, mapLocationId: string): Observable<any> | null {
    const newRouteMapLocation = {
      mapLocation: {
        id: mapLocationId
      },
      route: {
        id: routeId
      },
      sequenceNr: 1
    };

    return this.checkIfIsAlreadyCreated(routeId, mapLocationId).pipe(
      switchMap(isCreated => {
        if (!isCreated) {
          const url = `${backendUrl}/routeMapLocations`;
          return this.http.post(url, newRouteMapLocation);
        } else {
          return throwError(() => new MapLocationConflictError('This map location is already in your route!'));
        }
      })
    );
  }


  checkIfIsAlreadyCreated(routeId: string, mapLocationId: string): Observable<boolean> {
    return this.getRouteMapLocationByMapLocationId(mapLocationId).pipe(
      map((response: any[]) => {
        return response.some(location => location.route.id === routeId);
      })
    );
  }

  getRouteMapLocationByMapLocationId(mapLocationId: string): Observable<any> {
    const url = `${backendUrl}/mapLocation/${mapLocationId}/routeMapLocations`;
    return this.http.get(url);
  }
}
