import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {backendUrl, maxPageSize} from "../shared/http.config";
import {Page} from "../shared/page.model";
import {MapLocation} from "../map-location/map-location.model";
import {catchError, of} from "rxjs";
import {Audio} from "./audio.model";

@Injectable({providedIn: 'root'})
export class AudioService {


  constructor(private http: HttpClient) {}


  getAudiosByMapLocation(mapLocation: MapLocation, pageNumber: number, pageSize: number,) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize',pageSize.toString());

    //get audio entries
    const url = `${backendUrl}/mapLocations/${mapLocation.id}/audios`;
    return this.http.get<Page<Audio>>(url, { params });
  }


  getAudioFileByAudio(audio: Audio) {
    const url = `${backendUrl}/audios/${audio.id}/audio`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching audio:', error);
        return of(null);
      })
    );
  }


}
