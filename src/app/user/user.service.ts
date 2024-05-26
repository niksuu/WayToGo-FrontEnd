import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {backendUrl} from "../shared/http.config";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  getUserById(id: string){
    const url = `${backendUrl}/users/${id}`
    return this.http.get(url);
  }
}

