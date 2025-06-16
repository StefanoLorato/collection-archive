import { Component, inject } from '@angular/core';
import { BookmarkService } from '../../../service/bookmarkService';
import { UserService } from '../../../service/userService';
import { ActivatedRoute } from '@angular/router';
import { Bookmark } from '../../../models/bookmark';
import { Observable } from 'rxjs';
import { BookmarkCardItemComponent } from "../bookmark-card-item/bookmark-card-item.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookmarklist',
  imports: [BookmarkCardItemComponent, CommonModule],
  templateUrl: './bookmarklist.component.html',
  styleUrl: './bookmarklist.component.css'
})
export class BookmarklistComponent {
  private _bookmarkService = inject(BookmarkService);
  private _userService = inject(UserService);
  private _route = inject(ActivatedRoute);
  bookmark!: Bookmark[];
  userId!: number; 
  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id"); // Ora prendiamo l'ID bookmark dalla route
    if (id != null) {
      this.userId = +id;
      if (this.userId != 0 && !isNaN(this.userId)) {
        this.loadBookmark(this.userId);
      } else {
        alert("id-user non Trovato");
      }
    }
  }
  
  loadBookmark(userId: number) : void{
    const bookmarkObservable: Observable<Bookmark[]> = this._bookmarkService.getBookmarkByUserId(this.userId);
     bookmarkObservable.subscribe({
      next: data => this.bookmark = data,
      error: err => alert("Errore nel caricamento della bookmark: " + err)
    });
  }
  removeItemFromBookmark(obj: { id: number }) {
    if (!this.bookmark || !this.bookmark) return;
    this._bookmarkService.deleteBookmark(obj.id).subscribe({
      next: () => {
        this.bookmark = this.bookmark.filter((i) => i.itemId != obj.id);
        alert("l'item è stato eliminato con successo");
      },
      error: e => {
        alert("Errore nell cancellazione");
        this.loadBookmark(this.userId);
      }
    });
  }
  
}
