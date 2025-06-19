import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Collection } from '../../../models/collection';
import { Item } from '../../../models/item';

import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ShippingAddressService } from '../../../service/shippingAddressService';
import { Bookmark } from '../../../models/bookmark';
import { BookmarkService } from '../../../service/bookmarkService';
import { CartItem } from '../../../models/cartItem';
import { DiscussionComponent } from '../../discussion/discussion/discussion.component';
import { CollectionService } from '../../../services/collectionService';
import { ItemService } from '../../../services/itemService';
import { UserService } from '../../../services/userService';

@Component({
  selector: 'app-purchase',
  imports: [RouterLink, DiscussionComponent],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.css'
})
export class PurchaseComponent implements OnInit {
  collection!: Collection;
  item: Item | null = null;
  currentUser!: User;
  list: Item[] = [];
  owner!: User;
  currentImageIndex = 0;
  showDiscussion = false;
  private _collectionId!: number;
  private _itemId!: number;
  private _itemService = inject(ItemService);
  private _collectionService = inject(CollectionService);
  private _shippingAddressService = inject(ShippingAddressService);
  private _userService = inject(UserService);
  private _dataService = inject(DataService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  isAlreadyInCart: boolean = false;
  bookmark!: Bookmark;
  private _bookmarkService = inject(BookmarkService)

  @Output("bookmarkChanged") bookmarkChanged = new EventEmitter<{ id: number, bookmarked: boolean }>()
  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if (user != null) {
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
        this._dataService.shoppingCartObservable.subscribe(cart => {
          this.isAlreadyInCart = cart.items.some(i => i.id === this.item?.itemId) ||
            cart.collections.some(c => c.id === this.collection?.collectionId);
        });
      },
      error: e => alert("errore nel caricamento della collection: " + e)
    });
  }

  findItem(id: number) {
    this._itemService.getItemById(id).subscribe({
      next: (i) => {
        this.item = i;
        this.findUserById(this.item.userId);
        this._dataService.shoppingCartObservable.subscribe(cart => {
          this.isAlreadyInCart = cart.items.some(i => i.id === this.item?.itemId) ||
            cart.collections.some(c => c.id === this.collection?.collectionId);
        });
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

  findUserById(id: number) {
    this._userService.getUserById(id).subscribe({
      next: user => this.owner = user,
      error: err => alert("user non trovato" + err)
    })
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

  buyNow() {
    if (this.isAlreadyInCart) {
      alert("Questo oggetto è già nel tuo carrello!");
      this._router.navigate(['/dashboard']);
    }
    if (this.collection) {
      const cartItem: CartItem = {
        id: this.collection.collectionId,
        name: this.collection.collectionName,
        ownerId: this.collection.userId,
        price: this.collection.salePrice
      }
      this._dataService.addCollection(cartItem);
    }
    if (this.item) {
      const cartItem: CartItem = {
        id: this.item.itemId,
        name: this.item.itemName,
        ownerId: this.item.userId,
        price: this.item.salePrice
      };
      this._dataService.addItem(cartItem);
    }
    this._router.navigate(['/shipping-address-form'], { queryParams: { itemId: this.item?.itemId, collectionId: this.collection?.collectionId } });
  }

  addBookmark() {
    console.log("Bottone Save for Later premuto");

    if (!this.currentUser) {
      console.warn("Utente non definito");
      alert("Utente non disponibile");
      return;
    }

    // Bookmark sulla Collection
    if (this.collection) {
      const isBookmarked = !!this.collection.bookmarked;
      const bookmark: Bookmark = {
        userId: this.currentUser.userId,
        collectionId: this.collection.collectionId,
      };

      if (!isBookmarked) {
        this._bookmarkService.createBookmark(bookmark).subscribe({
          next: (b) => {
            console.log("Bookmark collection creato:", b);
            this.collection = {
              ...this.collection,
              bookmarked: true,
              bookmarkId: b.bookmarkId ?? null,
            };
            alert("Collection salvata tra i preferiti");
            this.bookmarkChanged.emit({ id: this.collection.collectionId, bookmarked: true });
          },
          error: (err) => {
            console.error("Errore aggiunta bookmark collection:", err);
            alert("Errore nel salvataggio della collection");
          },
        });
      } else {
        if (!this.collection.bookmarkId) {
          alert("BookmarkId mancante");
          return;
        }

        this._bookmarkService.deleteBookmark(this.collection.bookmarkId).subscribe({
          next: () => {
            console.log("Bookmark collection rimosso");
            this.collection = {
              ...this.collection,
              bookmarked: false,
              bookmarkId: null,
            };
            alert("Collection rimossa dai preferiti");
            this.bookmarkChanged.emit({ id: this.collection.collectionId, bookmarked: false });
          },
          error: (err) => {
            console.error("Errore rimozione bookmark collection:", err);
            alert("Errore nella rimozione della collection dai preferiti");
          },
        });
      }
      return;
    }
  }

  addToCart() {
    console.log("bottone add to cart premuto");

  }

   toggleDiscussion() {
    this.showDiscussion = !this.showDiscussion
   }
}
