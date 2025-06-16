import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngFor="let msg of messages" class="message">{{ msg }}</div>
    <input [(ngModel)]="newMessage" placeholder="Scrivi un messaggio..." />
    <button (click)="sendMessage()">Invia</button>
  `
})
export class ChatComponent {
  messages: string[] = [];
  newMessage = '';

  sendMessage() {
    if(this.newMessage.trim()) {
      this.messages.push(this.newMessage.trim());
      this.newMessage = '';
    }
  }
}
