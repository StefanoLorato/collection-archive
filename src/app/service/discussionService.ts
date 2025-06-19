import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Discussion } from "../models/discussion";


@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  private _url: string = "http://localhost:8080/api/discussions"
  private _http = inject(HttpClient)

  getDiscussions(): Observable<Discussion[]> {
    return this._http.get<Discussion[]>(this._url);
  }

  getDiscussionById(id: number): Observable<Discussion> {
    return this._http.get<Discussion>(`${this._url}/${id}`);
  }

  deleteDiscussion(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  addDiscussion(discussion : Partial<Discussion>): Observable<Discussion> {
    return this._http.post<Discussion>(this._url, discussion);
  }

  updateDiscussion(discussion: Discussion): Observable<void> {
    return this._http.put<void>(`${this._url}/${discussion.discussionId}`, discussion);
  }

  getDiscussionsByUserId(userId: number): Observable<Discussion[]> {
    return this._http.get<Discussion[]>(`${this._url}/user/${userId}`);
  }

  getDiscussionByCollectionAndUserId(collectionId: number): Observable<Discussion[]> {
    let params = new HttpParams().set("collectionId", collectionId);
    return this._http.get<Discussion[]>(this._url, {params});
  }

  getDiscussionByBuyerAndSeller(): Observable<Discussion[][]> {
    return this._http.get<Discussion[][]>(`${this._url}/logged-user/buyer-and-seller`);
  }
}
