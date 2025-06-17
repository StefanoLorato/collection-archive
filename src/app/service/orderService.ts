import { inject, Injectable } from "@angular/core";
import { Item } from "../models/item";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order } from "../models/order";
import { OrderItem } from "../models/orderItem";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  list: Item[] = [];
  private _url: string = "http://localhost:8080/api/orders"
  private _http = inject(HttpClient)

  getOrders(): Observable<Order[]> {
    return this._http.get<Order[]>(this._url);
  }

  getOrdersByItemSellerId(sellerId: number): Observable<Order[]>{
    let params = new HttpParams().set("sellerId", sellerId);
    return this._http.get<Order[]>(this._url, {params});
  }

  getOrderById(id: number): Observable<Order> {
    return this._http.get<Order>(`${this._url}/${id}`);
  }

  deleteOrder(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  addOrder(order: Partial<Order>): Observable<Order> {
    return this._http.post<Order>(this._url, order);
  }

  updateOrder(order: Order): Observable<void> {
    return this._http.put<void>(`${this._url}/${order.orderId}`, order);
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    return this._http.get<Order[]>(`${this._url}/user/${userId}`);
  }

  updateOrderItemStatus(status: string, orderId: number, orderItemId: number): Observable<OrderItem>{
    return this._http.patch<OrderItem>(`${this._url}/${orderId}/orderItems/${orderItemId}`, {status});
  }
}
