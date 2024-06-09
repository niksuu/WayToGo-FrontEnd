import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Page } from "../shared/page.model";
import { MapLocation } from "./map-location.model";
import { backendUrl } from "../shared/http.config";

@Injectable({ providedIn: 'root' })
export class MapLocationService {

  constructor(private http: HttpClient) {}

  getMapLocationsByRoute(pageNumber: number, pageSize: number, routeId: string) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const url = `${backendUrl}/routes/${routeId}/mapLocations`;
    return this.http.get<Page<MapLocation>>(url, { params });
  }

  postMapLocation(mapLocation: MapLocation, routeId: string) {
    const url = `${backendUrl}/mapLocations`;
    return this.http.post(url, mapLocation);
  }

  uploadMapLocationImage(mapLocationId: string, image: File) {
    const formData = new FormData();
    formData.append('image', image, image.name);
    const url = `${backendUrl}/mapLocations/${mapLocationId}/image`;
    return this.http.post(url, formData);
  }



}
