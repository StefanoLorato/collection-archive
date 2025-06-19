import { Component, inject, Input } from '@angular/core';
import { Discussion } from '../../../models/discussion';
import { User } from '../../../models/user';
import { DataService } from '../../../service/dataService';
import { DiscussionComponent } from '../discussion/discussion.component';

@Component({
  selector: 'app-discussion-card',
  imports: [DiscussionComponent],
  templateUrl: './discussion-card.component.html',
  styleUrl: './discussion-card.component.css'
})
export class DiscussionCardComponent {
  @Input("discussion") discussion!:Discussion;
  currentUser!:User;
  private _dataService = inject(DataService);
  showForm: boolean = false;  
  
    ngOnInit(): void {
      this._dataService.selectedUserObservable.subscribe(user => {
        if(user != null){
          this.currentUser = user;
        }
      });
    }

    toggleChat(){
      this.showForm = !this.showForm;

    }
}
