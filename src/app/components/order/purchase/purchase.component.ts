import { Component, inject, OnInit } from '@angular/core';
import { Collection } from '../../../models/collection';
import { Item } from '../../../models/item';
import { ItemService } from '../../../service/itemService';
import { CollectionService } from '../../../service/collectionService';
import { ShippingAddressService } from '../../../service/shippingAddressService';
import { CollectionCardComponent } from '../../collection/collection-card/collection-card.component';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { ActivatedRoute } from '@angular/router';
import { ItemCardComponent } from '../../item/item-card/item-card.component';
import { UserService } from '../../../service/userService';

@Component({
  selector: 'app-purchase',
  imports: [ItemCardComponent],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit{
  collection: Collection | null = null;
  item: Item | null = null;
  currentUser!: User;
  list: Item[] = [];
  owner!: User;
  currentImageIndex = 0;
  private _itemService = inject(ItemService);
  private _collectionService = inject(CollectionService);
  private _shippingAddressService = inject(ShippingAddressService);
  private _userService = inject(UserService);
  private _dataService = inject(DataService);
  private _route = inject(ActivatedRoute);
  private _collectionId!: number;
  private _itemId!: number;

  ngOnInit(): void {
  this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
    const id = this._route.snapshot.paramMap.get("id");
    const url = this._route.snapshot.url.map(segment => segment.path).join('/');

    if (id != null) {
      if (url.includes('collection')) {
        this._collectionId = +id;
        if (this._collectionId != 0 && !isNaN(this._collectionId)) {
          this.findCollection(this._collectionId);
          this.loadItems(this._collectionId);
          if(this.collection != null){
            console.log(this.owner.userId);

            this.findUserById(this.collection.userId);
          }
        } else {
          alert("id non valido");
        }
      } else if (url.includes('item')) {
        this._itemId = +id;
        if (this._itemId != 0 && !isNaN(this._itemId)) {
          this.findItem(this._itemId);
          if(this.item != null){
            this.findUserById(this.item.userId);
          }
        } else {
          alert("id non valido");
        }
      }
    }
  }

  findCollection(id: number) {
    this._collectionService.getCollectionById(id).subscribe({
      next: c => this.collection = c,
      error: e => alert("errore nel caricamento della collection: " + e)
    });
  }

  findItem(id: number) {
    this._itemService.getItemById(id).subscribe({
      next: i => this.item = i,
      error: e => alert("errore nel caricamento del item: " + e)
    });
  }

  loadItems(id: number) {
    this._itemService.getItemsByCollectionId(id).subscribe({
      next: items => this.list = items,
      error: e => alert("Errore nel caricamento degli item " + e)
    });
  }

  findUserById(id: number){
    this._userService.getUserById(id).subscribe({
      next: user => this.owner = user,
      error: err => alert("user non trovato" + err)
    })
  }

  handleRemove(id: number){

  }

get currentImage(): string | null {
  return this.list.length > 0 ? this.list[this.currentImageIndex].itemPhoto : null;
}

prevImage() {
  if (this.currentImageIndex > 0) {
    this.currentImageIndex--;
  }
}

nextImage() {
  if (this.currentImageIndex < this.list.length - 1) {
    this.currentImageIndex++;
  }
}
}
