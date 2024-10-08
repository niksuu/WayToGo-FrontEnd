import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Page} from "../shared/page.model";
import {MapLocation} from "./map-location.model";
import {backendUrl} from "../shared/http.config";
import {catchError, of, switchMap} from "rxjs";

@Injectable({providedIn: 'root'})
export class MapLocationService {

  constructor(private http: HttpClient) {
  }

  getMapLocationsByRoute(pageNumber: number, pageSize: number, routeId: string) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const url = `${backendUrl}/routes/${routeId}/mapLocations`;
    return this.http.get<Page<MapLocation>>(url, {params});
  }

  getMapLocationsById(mapLocationId: string) {
    const url = `${backendUrl}/mapLocations/${mapLocationId}`;
    return this.http.get<MapLocation>(url);
  }

  postMapLocation(mapLocation: MapLocation, routeId: string) {
    const url = `${backendUrl}/mapLocations`;
    return this.http.post(url, mapLocation);
  }

  putMapLocation(mapLocation: MapLocation, mapLocationId: string) {
    const url = `${backendUrl}/mapLocations/${mapLocationId}`;
    return this.http.put(url, mapLocation);
  }

  uploadMapLocationImage(mapLocationId: string, image: File) {
    const formData = new FormData();
    formData.append('file', image, image.name);
    const url = `${backendUrl}/mapLocations/${mapLocationId}/image`;
    return this.http.put(url, formData);
  }

  getMapLocationImageById(mapLocationId: string) {
    const url = `${backendUrl}/mapLocations/${mapLocationId}/image`;
    return this.http.get(url, {responseType: 'blob'}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching image:', error);
        return of(null);
      })
    );

  }

  deleteMapLocationFromRoute(mapLocationId: string, routeId: string) {
    let url = `${backendUrl}/mapLocation/${mapLocationId}/routeMapLocations`;
    return this.http.get<any[]>(url).pipe(
      switchMap(response => {
        if (response.length === 1) {
          url = `${backendUrl}/mapLocations/${mapLocationId}`;
        } else {
          const routeMapLocation = response.find(rML => rML.route.id === routeId);
          url = `${backendUrl}/routeMapLocations/${routeMapLocation.id}`;
        }
        return this.http.delete(url);
      })
    );
  }

  getMapLocations(){
    const url = `${backendUrl}/mapLocations`;
    return this.http.get<Page<MapLocation>>(url);
  }

  getMapLocationsByRange(lat: number, lng: number, range: number) {
    const url = `${backendUrl}/mapLocations`;

    const params = {
      lat: lat.toString(),
      lng: lng.toString(),
      range: range,
    };

    return this.http.get<Page<MapLocation>>(url, { params });
  }


}
