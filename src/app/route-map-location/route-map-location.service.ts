import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {backendUrl} from "../shared/http.config";

@Injectable({providedIn: 'root'})
export class RouteMapLocationService {

  constructor(private http: HttpClient) {}

  postRouteMapLocationService(routeId: string, mapLocationId: string) {
    let newRouteMapLocation = {
      mapLocation: {
        id: mapLocationId
      },
      route: {
        id: routeId
      },
      sequenceNr: 1
    }
    console.log("In postRouteMapLocation")
    console.log(newRouteMapLocation)
    const url = `${backendUrl}/routeMapLocations`
    return this.http.post(url, newRouteMapLocation)
  }
}
