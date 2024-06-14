import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {Route} from "./route.model";
import {Page} from "../shared/page.model";
import {backendUrl} from "../shared/http.config";
import {catchError, of} from "rxjs";
import {AuthService} from "../auth/auth.service";


@Injectable({providedIn: 'root'})
export class RouteService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getRoutes(pageNumber: number, pageSize: number, name?: string) {
        let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (name && name !== "") {
      params = params.append('routeName', name);
    }

    const url = `${backendUrl}/routes`

    return this.http.get<Page<Route>>(url, {params});
  }

  getRouteById(id: string) {
    const url = `${backendUrl}/routes/${id}`
    return this.http.get<Route>(url);
  }

  getRouteByUserId(pageNumber: number, pageSize: number, name?: string) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (name && name !== "") {
      params = params.append('routeName', name);
    }

    const userId = this.authService.getUserId();
      const url = `${backendUrl}/routes/${userId}/routes`;
    return this.http.get<Page<Route>>(url, {params});
  }

  postRoute(route: Route) {
    const url = `${backendUrl}/routes`;
    return this.http.post<Route>(url, route);
  }

  deleteRouteById(id: string) {
    const url = `${backendUrl}/routes/${id}`
    return this.http.delete<Route>(url);
  }

  patchRouteById(id: string, route: Route) {
    const url = `${backendUrl}/routes/${id}`
    return this.http.patch<Route>(url, route);
  }

  /*getRouteImageById(id: string) {
    const url = `${backendUrl}/routes/${id}/image`;
    return this.http.get<Blob>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        //throw error;
        return of(null);
      })
    );
  }*/

  uploadRouteImage(id: string, file: File) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const url = `${backendUrl}/routes/${id}/image`;
    return this.http.put<void>(url, formData);
  }


  getRouteImageById(id: string) {
    const url = `${backendUrl}/routes/${id}/image`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching image:', error);
        return of(null);
      })
    );
  }
}
