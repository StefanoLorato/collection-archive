import { Component, inject, OnInit } from '@angular/core';
import { WishlistService } from '../../../service/wishListService';
import { Observable } from 'rxjs';
import { UserService } from '../../../service/userService';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemAddComponent } from '../../item/item-add/item-add.component';
import { WishList } from '../../../models/wishList';
import { WishlistItemCardComponent } from '../wishlist-item-card/wishlist-item-card.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';

@Component({
  selector: 'app-wish-list',
  imports: [FormsModule, WishlistItemCardComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent implements OnInit {
  showAddForm = false;
  newDesiredItem: Partial<WishList> = {
    itemName: '',
    itemDescription: '',
    releaseDate: '',
    itemVersion: '',
    itemEdition: ''
  };
  private _wishListService = inject(WishlistService);
  private _collectionService = inject(CollectionService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  wishList: WishList[] = [];
  collectionId!: number;
  collection!: Collection;

  ngOnInit(): void {
    const collectionId = this._route.snapshot.paramMap.get('id');

    if (collectionId) {
      this.collectionId = Number(collectionId);
      this.newDesiredItem.collectionId = this.collectionId;
      this.loadWishList(this.collectionId);
      this.findCollection(this.collectionId);
    } else {
      alert('Miss Collection ID');
      this._router.navigate(['/collection-list']);
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
    if (!this.wishList) return;
    this._wishListService.deleteWishListItem(obj.id).subscribe({
      next: () => {
        this.wishList = this.wishList.filter((i) => i.desiredObjectId != obj.id);
        alert("l'item è stato eliminato con successo");
      },
      error: e => {
        alert("Errore nell cancellazione");
        this.loadWishList(this.collectionId);
      }
    });
  }

  toggleForm() {
    this.showAddForm = !this.showAddForm;
  }

  addWishListItem(form: NgForm) {
    if(form.invalid || !this.collectionId) return;
    this.newDesiredItem.collectionId = this.collectionId;

    this._wishListService.createWishListItem(this.newDesiredItem).subscribe({
      next: w => {
        alert('Item creato con ID: ' + w.desiredObjectId);
        this.wishList.push(w);
      },
      error: e => {
        console.error('Errore nella creazione item:', e)
      }
    });
  }

  findCollection(id: number) {
    this._collectionService.getCollectionById(id).subscribe({
      next: c => this.collection = c,
      error: e => alert("errore nel caricamento della collection: " + e)
    });
  }
}
