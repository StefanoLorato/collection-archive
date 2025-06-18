import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bookmark } from "../models/bookmark";

@Injectable({
    providedIn: 'root'
})
export class BookmarkService{
    private _url: string = "http://localhost:8080/api/bookmarks";
    private _http = inject(HttpClient);

    getBookmarkById(id: number): Observable<Bookmark> {
        return this._http.get<Bookmark>(`${this._url}/${id}`);
      }

    getAllBookmark(): Observable<Bookmark[]> {
        return this._http.get<Bookmark[]>(this._url);
      }

    getBookmarkByUserId(id: number): Observable<Bookmark[]>{
        return this._http.get<Bookmark[]>(`${this._url}/user/${id}`);
    }

    createBookmark(dto: Bookmark): Observable<Bookmark> {
        return this._http.post<Bookmark>(this._url, dto);
      }

    deleteBookmark(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
      }

    updateBookmark(id: number, dto: Bookmark): Observable<void> {
        return this._http.put<void>(`${this._url}/${id}`, dto);
      }

}
