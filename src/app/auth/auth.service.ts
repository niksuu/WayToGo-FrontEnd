import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {backendUrl} from "../shared/http.config";
import {Page} from "../shared/page.model";
import {Route} from "../route/route.model";
import {Observable, tap} from "rxjs";
import jwt_decode from "jwt-decode";


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
  logout(): void {
    localStorage.removeItem('jwt_token');
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      // @ts-ignore
      const decoded: any = jwt_decode(token);
      return decoded.userId || null;
    }
    return null;
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  isTokenExpired(token: string): boolean {
    // @ts-ignore
    const decoded: any = jwt_decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }


}
