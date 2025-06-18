import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { Observable } from 'rxjs';
import { UserService } from '../../../service/userService';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { CollectionCardComponent } from '../../collection/collection-card/collection-card.component';
import { Cart } from '../../../models/cart';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CollectionCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  collection!: Collection;
  list: Collection[] = [];
  private _collectionService = inject(CollectionService);
  private _userService = inject(UserService);
  private _dataService = inject(DataService);
  currentUserId!: number;
  currentUser!: User;
  ownerUser!: User;
  cart!: Cart;

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe( user => {
        if(user!= null){
          this.currentUser = user
        }
      });
    this._dataService.shoppingCartObservable.subscribe(cart => {
      this.cart = cart;
    });
    this.loadAllCollection();
  }
  get visibleCollections() {
    return this.list.filter(
      c => c.visibility === 'visible'
    );
  }

  handleDelete(obj: { id: number }) {
    console.log(obj.id);
    this._collectionService.deleteCollection(obj.id).subscribe({
      next: () => {
        this.list = this.list.filter((c) => c.collectionId != obj.id);
        alert("La collection è stata eliminata con successo");
      },
      error: e => {
        alert("Errore nella cancellazione della collection");
        this.loadAllCollection();
      }
    });
  }

  loadAllCollection() {
    const toDoObservable: Observable<Collection[]> = this._collectionService.getCollections();
    toDoObservable.subscribe({
      next: collections => {
        this.list = collections;
        this.list = this.list.filter(c => !this.cart.collections.some(ci => ci.id === c.collectionId));
      },
      error: e => alert("Errore di caricamento della collection " + e)
    });
  }

  findUserById(id: number){
    this._userService.getUserById(id).subscribe({
      next: u => this.ownerUser = u,
      error: e => alert("errore nel caricamento dell'user: " + e)
    })
  }
}
