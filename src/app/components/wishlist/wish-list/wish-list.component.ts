import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../../service/wishListService';
import { Observable } from 'rxjs';
import { UserService } from '../../../service/userService';
import { ActivatedRoute } from '@angular/router';
import { ItemAddComponent } from '../../item/item-add/item-add.component';
import { WishList } from '../../../models/wishList';
import { WishlistItemCardComponent } from '../wishlist-item-card/wishlist-item-card.component';

@Component({
  selector: 'app-wish-list',
  imports: [ WishlistItemCardComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  private _wishListService = inject(WishlistService);
  private _userService = inject(UserService);
  private _route = inject(ActivatedRoute);
  wishList!: WishList[];
  collectionId!: number;
  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id"); // Ora prendiamo l'ID collection dalla route
    if (id != null) {
      this.collectionId = +id;
      if (this.collectionId != 0 && !isNaN(this.collectionId)) {
        this.loadWishList(this.collectionId);
      } else {
        alert("idcollection non Trovato");
      }
    }

  }

  loadWishList(collectionId: number): void {
    const wishListObservable: Observable<WishList[]> = this._wishListService.getWishListByCollectionId(collectionId);
    wishListObservable.subscribe({
      next: data => this.wishList = data,
      error: err => alert("Errore nel caricamento della wishList: " + err)
    });
  }

  removeItemFromWishList(obj: { id: number }) {
    if (!this.wishList || !this.wishList) return;
    this._wishListService.deleteWishListItem(obj.id).subscribe({
      next: () => {
        this.wishList = this.wishList.filter((i) => i.itemId != obj.id);
        alert("l'item è stato eliminato con successo");
      },
      error: e => {
        alert("Errore nell cancellazione");
        this.loadWishList(this.collectionId);
      }
    });
  }
}