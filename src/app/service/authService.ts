import { inject, Injectable } from "@angular/core";
import { Item } from "../models/item";
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { User } from "../models/user";
import { Token } from "@angular/compiler";
import { DataService } from "./dataService";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _dataService = inject(DataService);
  list: Item[] = [];
  private _url: string = "http://localhost:8080/api/auth"
  private _http = inject(HttpClient);

  login(credentials: {email: string; password: string}): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this._url}/login`, credentials).pipe(
      tap((res) => this.saveToken(res.token))
    );
  }

  register(name: string, lastname: string, email: string, password: string, country: string): Observable<void> {
    return this._http.post<void>(`${this._url}/register`, { name: name, lastname: lastname, email: email, password: password, country: country });
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('loggedUser');
    this._dataService.unselectUser();
  }
}
