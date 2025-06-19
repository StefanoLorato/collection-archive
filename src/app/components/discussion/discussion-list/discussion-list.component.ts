import { Component, inject } from '@angular/core';
import { DiscussionComponent } from "../discussion/discussion.component";
import { DataService } from '../../../service/dataService';
import { DiscussionService } from '../../../service/discussionService';
import { Discussion } from '../../../models/discussion';
import { User } from '../../../models/user';
import { DiscussionCardComponent } from '../discussion-card/discussion-card.component';

@Component({
  selector: 'app-discussion-list',
  imports: [DiscussionCardComponent],
  templateUrl: './discussion-list.component.html',
  styleUrl: './discussion-list.component.css'
})
export class DiscussionListComponent {
  private _dataService = inject(DataService);
  private _discussionService = inject(DiscussionService);
  buyerDiscussionList!:Discussion[];
  sellerDiscussionList!: Discussion[];
  currentUser!:User;


  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
        this.loadDiscussions();
      }
    });
  }

  loadDiscussions(){
    this._discussionService.getDiscussionByBuyerAndSeller().subscribe({
      next:d => {
        this.buyerDiscussionList = d[0];
        this.sellerDiscussionList = d[1];
      },
      error:(err) => {
          alert("Non è possibile recuperare la conversazione con questo utente!")
      },
    })
  }
}
