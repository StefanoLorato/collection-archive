import { Component, inject } from '@angular/core';
import { User } from '../../../models/user';
import { Cart } from '../../../models/cart';
import { DataService } from '../../../service/dataService';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './cart-item-list.component.html',
  styleUrl: './cart-item-list.component.css'
})
export class CartItemListComponent {
  cart!: Cart;
  currentUser!: User;
  private _dataService = inject(DataService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._dataService.shoppingCartObservable.subscribe(c => this.cart = c);
    this._dataService.selectedUserObservable.subscribe(u => {
      if(u!= null){
          this.currentUser = u
        }
    });
  }

  buyAll() {
    this._router.navigate(['/shipping-address-form']);
  }

  removeCollection(id: number){
    this._dataService.removeCollection(id);
  }

  removeItem(id: number){
    this._dataService.removeItem(id);
  }

  getTotalPrice(): number {
  const itemTotal = this.cart.items.reduce((acc, i) => acc + i.price, 0);
  const collTotal = this.cart.collections.reduce((acc, c) => acc + c.price, 0);
  return itemTotal + collTotal;
}
}
