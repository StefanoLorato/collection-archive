import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../service/wishListService';
import { Observable } from 'rxjs';
import { UserService } from '../../service/userService';
import { ActivatedRoute } from '@angular/router';
import { ItemListComponent } from '../item/item-list/item-list.component';
import { ItemAddComponent } from '../item/item-add/item-add.component';
import { ItemCardComponent } from '../item/item-card/item-card.component';

@Component({
  selector: 'app-wish-list',
  imports: [ItemAddComponent, ItemCardComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  private _wishListService = inject(WishlistService);
  private _userService = inject(UserService);
  private _route = inject(ActivatedRoute);
  wishList!: any;
  collectionId!: number;

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("collectionId"); // Ora prendiamo l'ID collection dalla route
    if (id != null) {
      this.collectionId = +id;
      this.loadWishList(this.collectionId);
    } else {
      alert("Errore: ID collection non trovato.");
    }
  }

  loadWishList(collectionId: number): void {
    const wishListObservable: Observable<any> = this._wishListService.getWishListById(collectionId);
    wishListObservable.subscribe({
      next: data => this.wishList = data,
      error: err => alert("Errore nel caricamento della wishList: " + err)
    });
  }
  removeItem(event: { id: number }) {
  if (!this.wishList || !this.wishList.items) return;
  
  this.wishList.items = this.wishList.items.filter((item: { itemId: number; }) => item.itemId !== event.id);
  alert("Item rimosso con successo!");
}
}