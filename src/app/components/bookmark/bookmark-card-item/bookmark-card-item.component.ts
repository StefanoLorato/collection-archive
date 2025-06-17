import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Bookmark } from '../../../models/bookmark';
import { Item } from '../../../models/item';
import { Collection } from '../../../models/collection';

@Component({
  selector: 'app-bookmark-card-item',
  imports: [],
  templateUrl: './bookmark-card-item.component.html',
  styleUrl: './bookmark-card-item.component.css'
})
export class BookmarkCardItemComponent {
  
  item: Item | null = null; 
  collection: Collection | null = null;  

  @Input('bookmarkitem') bookmarkitem!: Bookmark;
  @Output('deleteBookmarkItem') deleteBookmarkItem = new EventEmitter<({id: number})>;
  


  OnDelete(id: number) {
    this.deleteBookmarkItem.emit({id: id})
  }

}
