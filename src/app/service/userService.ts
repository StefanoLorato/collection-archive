import { inject, Injectable } from "@angular/core";
import { Item } from "../models/item";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { PasswordUpdate } from "../models/passwordUpdate";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    list: User[] = [];
    private _url: string = "http://localhost:8080/api/users"
    private _http = inject(HttpClient)

    getUser(): Observable<User[]> {
        return this._http.get<User[]>(this._url);
    }

    deleteUser(id: number): Observable<void> {
        return this._http.delete<void>(`${this._url}/${id}`);

    }

    getUSerById(id: number): Observable<Item> {
        return this._http.get<Item>(`${this._url}/${id}`);
    }


    deactivateUser(user: User): Observable<void> {
        return this._http.put<void>(`${this._url}/${user.userId}`, user);
    }

    getUserInfo(): Observable<User> {
        return this._http.get<User>(`${this._url}/userInfo`);
    }

    // 2. Aggiorna la password
    updatePassword(dto: PasswordUpdate): Observable<void> {
        return this._http.put<void>(`${this._url}/password`, dto);
    }
}
