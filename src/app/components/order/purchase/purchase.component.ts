import { Component, inject, OnInit } from '@angular/core';
import { Collection } from '../../../models/collection';
import { Item } from '../../../models/item';
import { ItemService } from '../../../service/itemService';
import { CollectionService } from '../../../service/collectionService';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../service/userService';
import { ShippingAddressService } from '../../../service/shippingAddressService';
import { CartItem } from '../../../models/cart-item';

@Component({
  selector: 'app-purchase',
  imports: [],
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
  private _collectionId!: number;
  private _itemId!: number;
  private _itemService = inject(ItemService);
  private _collectionService = inject(CollectionService);
  private _shippingAddressService = inject(ShippingAddressService);
  private _userService = inject(UserService);
  private _dataService = inject(DataService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);


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

        } else {
          alert("id non valido");
        }
      } else if (url.includes('item')) {
        this._itemId = +id;
        if (this._itemId != 0 && !isNaN(this._itemId)) {
          this.findItem(this._itemId);
        } else {
          alert("id non valido");
        }
      }
    }
  }

  findCollection(id: number) {
    this._collectionService.getCollectionById(id).subscribe({
      next: c => {
        this.collection = c;
        this.findUserById(this.collection.userId);
        const cartItem: CartItem = {
          id: this.collection.collectionId,
          name: this.collection.collectionName,
          ownerId: this.collection.userId,
          price: this.collection.salePrice
        }
        this._dataService.addCollection(cartItem);
      },
      error: e => alert("errore nel caricamento della collection: " + e)
    });
  }

  findItem(id: number) {
    this._itemService.getItemById(id).subscribe({
      next: (i) => {
        this.item = i;
        this.findUserById(this.item.userId);
        const cartItem: CartItem = {
          id: this.item.itemId,
          name: this.item.itemName,
          ownerId: this.item.userId,
          price: this.item.salePrice
        }
        this._dataService.addItem(cartItem);
      },
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

  buyNow(){
    this._router.navigate(['/shipping-address-form'], { queryParams: { itemId: this.item?.itemId, collectionId: this.collection?.collectionId } });
  }
}
