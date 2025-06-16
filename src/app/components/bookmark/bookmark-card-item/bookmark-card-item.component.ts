import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bookmark } from '../../../models/bookmark';

@Component({
  selector: 'app-bookmark-card-item',
  imports: [],
  templateUrl: './bookmark-card-item.component.html',
  styleUrl: './bookmark-card-item.component.css'
})
export class BookmarkCardItemComponent {
  

  @Input('bookmarkitem') bookmarkitem!: Bookmark;
  @Output('deleteBookmarkItem') deleteBookmarkItem = new EventEmitter<({id: number})>;

  OnDelete(id: number) {
    this.deleteBookmarkItem.emit({id: id})
  }

}
