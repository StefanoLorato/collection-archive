import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '../../../models/collection';
import { Item } from '../../../models/item';
import { DataService } from '../../../service/dataService';
import { Cart } from '../../../models/cart';
import { OrderService } from '../../../service/orderService';
import { User } from '../../../models/user';
import { Order } from '../../../models/order';
import { OrderItem } from '../../../models/orderItem';

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.css'
})
export class PaymentFormComponent implements OnInit{
  private _router = inject(Router);
  private _dataService = inject(DataService);
  private _orderService = inject(OrderService);
  cart!: Cart;
  currentUser!: User;
  private _route = inject(ActivatedRoute);
  private _addressId!: number;
  private _order!: Order;


  fb = inject(FormBuilder);
  collection: Collection | null = null;
  item: Item | null = null;

  paymentForm: FormGroup = this.fb.group({
    cardName: ['', Validators.required],
    cardNumber: ['', [Validators.required]],
    expiryDate: ['', [Validators.required]],
    cvv: ['', [Validators.required]],
    paymentType: ['visa', Validators.required]
  });

  ngOnInit(): void {
    this._dataService.shoppingCartObservable.subscribe(c => this.cart = c);
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
    this._addressId = Number(this._route.snapshot.queryParamMap.get("addressId") ?? 0);
  }

  submit() {
    if (this.paymentForm.valid) {
      const order: Order = {buyerId: this.currentUser.userId,
        shippingAddressId: this._addressId, orderItems: []};
      this.cart.collections.forEach(c => {
        const orderCollection: OrderItem = {
          sellerId: c.ownerId,
          collectionId: c.id,
          price: c.price
        };
        order.orderItems.push(orderCollection);
      });
      this.cart.items.forEach(c => {
        const orderItem: OrderItem = {
          sellerId: c.ownerId,
          itemId: c.id,
          price: c.price
        };
        order.orderItems.push(orderItem);
      })
      this._orderService.addOrder(order).subscribe({
        next: o => {
          alert('Order creato con ID: ' + o.orderId);
          this._router.navigate(['/order-list', this.currentUser.userId]);
        }
      })
    }
  }

  goBack() {
    this._router.navigate(['/shipping-address-form', { queryParams: { itemId: this.item?.itemId, collectionId: this.collection?.collectionId }}]);
  }

}
