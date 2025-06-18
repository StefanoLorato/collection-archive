import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserComment } from '../models/userComment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserCommentService {
  private _http = inject(HttpClient);
  private _url = 'http://localhost:8080/api/comments';

  // GET all comments
  getAllComments(): Observable<UserComment[]> {
    return this._http.get<UserComment[]>(this._url);
  }

  // GET comment by id
  getCommentById(id: number): Observable<UserComment> {
    return this._http.get<UserComment>(`${this._url}/${id}`);
  }

  // POST create comment
  createComment(comment: Partial<UserComment>): Observable<UserComment> {
    return this._http.post<UserComment>(this._url, comment);
  }

  // PUT update comment
  updateComment(comment: UserComment): Observable<void> {
    return this._http.put<void>(`${this._url}/${comment.commentId}`, comment);
  }

  // DELETE comment
  deleteComment(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  getCommentsByCollectionId(id: Number):Observable<UserComment[]> {
    let params = new HttpParams().set("collectionId",""+ id);
    return this._http.get<UserComment[]>(this._url, {params});
  }
}
