import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {backendUrl} from "../shared/http.config";
import {Page} from "../shared/page.model";
import {Route} from "../route/route.model";
import {Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = `${backendUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(`${this.url}/register`, user);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }
}
