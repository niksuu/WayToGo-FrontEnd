import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { backendUrl } from "../shared/http.config";
import {Observable, of, switchMap} from "rxjs";
import { map } from "rxjs/operators";

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
          alert('This map Location is already in your route!')
          return of(null); // Zwraca Observable z wartością `null`, gdy rekord już istnieje
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
