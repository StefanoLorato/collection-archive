import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { WishList } from '../../../models/wishList';

@Component({
  selector: 'app-wishlist-item-card',
  imports: [],
  templateUrl: './wishlist-item-card.component.html',
  styleUrl: './wishlist-item-card.component.css'
})
export class WishlistItemCardComponent {

  @Input('wishlistItem') wishlistItem!: WishList;
  @Output("deleteWishListItem") deleteWishListItem = new EventEmitter<({id: number})>;

  OnDelete(id: number) {
    this.deleteWishListItem.emit({id: id})
  }

}
