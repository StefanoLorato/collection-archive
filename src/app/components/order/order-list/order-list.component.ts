import { Component, inject } from '@angular/core';
import { Order } from '../../../models/order';
import { User } from '../../../models/user';
import { DataService } from '../../../service/dataService';
import { OrderService } from '../../../service/orderService';
import { OrderItemService } from '../../../service/orderItemService';
import { OrderItem } from '../../../models/orderItem';
import { UserService } from '../../../services/userService';

@Component({
  selector: 'app-order-list',
  imports: [],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  orders: Order[] = [];
  receivedOrders: Order[] = [];
  currentUser!: User;
  seller!: User;
  sellerMap: Map<number, User> = new Map();
  private _dataService = inject(DataService);
  private _orderService = inject(OrderService);
  private _orderItemService = inject(OrderItemService);
  private _userService = inject(UserService);

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(u => {
      if (u) {
        this.currentUser = u;
      }
    });
    this.loadOrders();
  }

  loadOrders(){
    this._orderService.getOrdersByUserId(this.currentUser.userId).subscribe({
      next: all => {
        this.orders = all.filter(o => o.buyerId === this.currentUser.userId);

        const sellerIds = this.orders.flatMap(o => o.orderItems.map(oi => oi.sellerId));
        sellerIds.forEach(id => {
          this._userService.getUserById(id).subscribe({
            next: user => this.sellerMap.set(id, user),
            error: err => console.error("Errore caricamento venditore ID " + id, err)
          });
        });
      }
    });

    this._orderService.getOrdersByItemSellerId(this.currentUser.userId).subscribe({
      next: oi => {
        console.log(oi);

        this.receivedOrders = oi;
      }
    })
  }

  findSelleryId(id: number){
    this._userService.getUserById(id).subscribe({
      next: u => this.seller = u,
      error: e => alert("errore nel caricamento dell'user: " + e)
    })
  }

  changeOrderStatus(orderItem: OrderItem, status: string){
    this._orderService.updateOrderItemStatus(status, orderItem.orderId!, orderItem.orderItemId!).subscribe({
      next: oi => {
        this.receivedOrders = this.receivedOrders.map( o => {
          if(o.orderId == oi.orderId){
            const items = o.orderItems.map(item => {
              if(item.orderItemId == oi.orderItemId){
                item.status = status;
                return item;
              } else {
                return item;
              }
            });
            o.orderItems = items;
            return o;
          } else {
            return o;
          }
        });
        alert("ordine " + oi.status)
      },
      error: err => {
        alert("errore nel cambiamento dello stato dell'ordine");
        console.log("errore nell'cambiamento dello stato dell'ordine " + err);
      }
    })
  }

  accept(orderItem: OrderItem){
    this.changeOrderStatus(orderItem, "accepted");
    // cambia visibility_status a sold
  }

  decline(orderItem: OrderItem){
    this.changeOrderStatus(orderItem, "rejected");
  }

}
