import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Page} from "../shared/page.model";
import {MapLocation} from "./map-location.model";
import {Route} from "../route/route.model";
import {backendUrl} from "../shared/http.config";


@Injectable({providedIn: 'root'})
export class MapLocationService {

  constructor(private http: HttpClient) {}
  getMapLocationsByRoute(pageNumber: number, pageSize: number, routeId: string) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    const url = `${backendUrl}/routes/${routeId}/mapLocations`
    return this.http.get<Page<MapLocation>>(url, { params });
  }

}
