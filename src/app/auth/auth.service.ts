import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {backendUrl} from "../shared/http.config";
import {Page} from "../shared/page.model";
import {Route} from "../route/route.model";
import {BehaviorSubject, Observable, tap} from "rxjs";
import { jwtDecode } from 'jwt-decode'; // Use the actual named export from the module

import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = `${backendUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(false);

  // Observable do subskrypcji
  isLoggedIn$ = this.loggedIn.asObservable();


  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('jwt_token', response.token);
          this.loggedIn.next(true);
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
    this.loggedIn.next(false);
    this.router.navigate(['/']);
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (token) {
      // @ts-ignore
      const decoded: any = jwtDecode(token);
      return decoded.userId || null;
    }
    return null;
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    const isValid =  token ? !this.isTokenExpired(token) : false;
    this.loggedIn.next(isValid);
    return isValid;

  }

  isTokenExpired(token: string): boolean {
    // @ts-ignore
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }


}
