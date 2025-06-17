import { Component, inject } from '@angular/core';
import { BookmarkService } from '../../../service/bookmarkService';
import { UserService } from '../../../service/userService';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { CollectionCardComponent } from '../../collection/collection-card/collection-card.component';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';

@Component({
  selector: 'app-bookmarklist',
  imports: [CommonModule, CollectionCardComponent],
  templateUrl: './bookmarklist.component.html',
  styleUrl: './bookmarklist.component.css'
})
export class BookmarklistComponent {
  private _dataService = inject(DataService);
  private _bookmarkService = inject(BookmarkService);
  private _userService = inject(UserService);
  private _collectionService = inject(CollectionService);
  private _route = inject(ActivatedRoute);
  list!: Collection[];
  userId!: number;
  currentUser!: User;

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
    this.loadBookmark();
  }

  loadBookmark() : void{
    const bookmarkObservable: Observable<Collection[]> = this._collectionService.getCollectionsByUserId(this.currentUser.userId);
     bookmarkObservable.subscribe({
      next: data => this.list = data,
      error: err => alert("Errore nel caricamento della bookmark: " + err)
    });
  }
  removeBookmark(obj: { id: number }) {
    if (!this.list) return;
    this._bookmarkService.deleteBookmark(obj.id).subscribe({
      next: () => {
        this.list = this.list.filter((b) => b.bookmarkId != obj.id);
        alert("il bookmark è stato eliminato con successo");
      },
      error: e => {
        alert("Errore nell cancellazione");
        this.loadBookmark();
      }
    });
  }

}
