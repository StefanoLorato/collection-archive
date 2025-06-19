import { Component, inject, Input, OnInit } from '@angular/core';
import { Message } from '../../../models/message';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';

@Component({
  selector: 'app-message',
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit{
  @Input("message") message!:Message;
  private _dataService = inject(DataService);
  currentUser!:User;

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
  }
}
