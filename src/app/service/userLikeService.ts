import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserLike } from "../models/userLike";

@Injectable({
  providedIn: 'root'
})
export class UserLikeService {
  private _url: string = "http://localhost:8080/api/userlikes";
  private _http = inject(HttpClient);

  getLikes(): Observable<UserLike[]> {
    return this._http.get<UserLike[]>(this._url);
  }

  getLikeById(id: number): Observable<UserLike> {
    return this._http.get<UserLike>(`${this._url}/${id}`);
  }

  getLikesByUserId(userId: number): Observable<UserLike[]> {
    return this._http.get<UserLike[]>(`${this._url}/user/${userId}`);
  }
  //manca backend
  getLikesByItemId(itemId: number): Observable<UserLike[]> {
    return this._http.get<UserLike[]>(`${this._url}/item/${itemId}`);
  }

  addLike(like: UserLike): Observable<UserLike> {
    return this._http.post<UserLike>(this._url, like);
  }

  updateLike(like: UserLike): Observable<void> {
    return this._http.put<void>(`${this._url}/${like.likeId}`, like);
  }

  deleteLike(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }
}
