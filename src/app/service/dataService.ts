import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";
import { Cart } from "../models/cart";
import { Item } from "../models/item";
import { CartItem } from "../models/cart-item";

@Injectable({
    providedIn: "root"
})
// export class DataService {
//     private _selectedUserBehavior = new BehaviorSubject<User| null>(null);
//     selectedUserObservable = this._selectedUserBehavior.asObservable();

//     selectedUser(name: User) {
//         this._selectedUserBehavior.next(name);
//     }

//     clearUsers() {
//         this._selectedUserBehavior.next(null);
//     }

// }

export class DataService {
  private _selectedUserBehavior: BehaviorSubject<User | null>;
  private _shoppingCartBehavior: BehaviorSubject<Cart>;

  selectedUserObservable;
  shoppingCartObservable;
  cart!: Cart;

  constructor() {
    const savedUser = localStorage.getItem('loggedUser');
    this._selectedUserBehavior = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.cart = {items: [], collections: []};
    this.selectedUserObservable = this._selectedUserBehavior.asObservable();
    this._shoppingCartBehavior = new BehaviorSubject<Cart>(this.cart);
    this.shoppingCartObservable = this._shoppingCartBehavior.asObservable();
  }

  selectedUser(user: User) {
    this._selectedUserBehavior.next(user);
  }

  unselectUser(){
    this._selectedUserBehavior.next(null);
  }

  addItem(item: CartItem){
    this.cart.items.push(item);
    this._shoppingCartBehavior.next(this.cart);
  }

  addCollection(collection: CartItem){
    this.cart.collections.push(collection);
    this._shoppingCartBehavior.next(this.cart);
  }

  clearCart(){
    this.cart.items.length = 0;
    this.cart.collections.length = 0;
  }

  removeItem(id: number): boolean{
    const initialLength = this.cart.items.length;
    this.cart.items = this.cart.items.filter(i => i.id != id);
    this._shoppingCartBehavior.next(this.cart);
    return initialLength != this.cart.items.length;
  }

  removeCollection(id: number): boolean{
    const initialLength = this.cart.collections.length;
    this.cart.collections = this.cart.collections.filter(c => c.id != id);
    this._shoppingCartBehavior.next(this.cart);
    return initialLength != this.cart.collections.length;
  }
}
