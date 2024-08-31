import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {backendUrl, maxPageSize} from "../shared/http.config";
import {Page} from "../shared/page.model";
import {MapLocation} from "../map-location/map-location.model";
import {catchError, Observable, of, throwError} from "rxjs";
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


  getAudioById(audioId: string): Observable<Audio> {
    const url = `${backendUrl}/audios/${audioId}`;
    return this.http.get<Audio>(url);
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

  postAudio(audio: Audio) {
    const url = `${backendUrl}/audios`;
    return this.http.post<Audio>(url, audio).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error adding audio:', error);
        throw error; // Przekaż dalej błąd do obsługi w komponencie
      })
    );
  }

  uploadAudioFile(audioId: string, file: File) {
    const url = `${backendUrl}/audios/${audioId}/audio`;
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(url, formData, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error uploading audio file:', error);
        throw error; // Przekaż dalej błąd do obsługi w komponencie
      })
    );
  }

  deleteAudio(audioId: string) {
    const url = `${backendUrl}/audios/${audioId}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError)
    );
  }

  updateAudio(audio: Audio): Observable<Audio> {
    const url = `${backendUrl}/audios/${audio.id}`;
    return this.http.put<Audio>(url, audio);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }

}
