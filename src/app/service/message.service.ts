import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MessageDTO {
  id?: number;
  senderId: number;
  discussionId: number;
  content: string;
  timestamp?: string;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = '/api/messages'; // <-- metti l'URL corretto

  constructor(private http: HttpClient) {}

  getMessagesByDiscussionId(discussionId: number): Observable<MessageDTO[]> {
    return this.http.get<MessageDTO[]>(`${this.apiUrl}/discussion/${discussionId}`);
  }

  sendMessage(message: MessageDTO): Observable<MessageDTO> {
    return this.http.post<MessageDTO>(this.apiUrl, message);
  }
}
