import { Component, Input } from '@angular/core';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
@Input("message") message!:Message;
}
