import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Message } from "../models/message";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private _url: string = "http://localhost:8080/api/messages"
  private _http = inject(HttpClient)

  getMessages(): Observable<Message[]> {
    return this._http.get<Message[]>(this._url);
  }

  getMessageById(id: number): Observable<Message> {
    return this._http.get<Message>(`${this._url}/${id}`);
  }

  deleteMessage(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  addMessage(message :Message): Observable<Message> {
    return this._http.post<Message>(this._url, message);
  }

  updateMessage(message: Message): Observable<void> {
    return this._http.put<void>(`${this._url}/${message.messageId}`, message);
  }

  getMessagesByDiscussionId(discussionId: number): Observable<Message[]> {
    return this._http.get<Message[]>(`${this._url}/discussion/${discussionId}`);
  }
}
