import { inject, Injectable } from "@angular/core";
import { Item } from "../models/item";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OrderItem } from "../models/orderItem";

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  list: Item[] = [];
  private _url: string = "http://localhost:8080/api/orderItems"
  private _http = inject(HttpClient)

  getOrderItems(): Observable<OrderItem[]> {
    return this._http.get<OrderItem[]>(this._url);
  }

  getOrderItemById(id: number): Observable<OrderItem> {
    return this._http.get<OrderItem>(`${this._url}/${id}`);
  }

  deleteOrderItem(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  addOrderItem(orderItem: Partial<OrderItem>): Observable<OrderItem> {
    return this._http.post<OrderItem>(this._url, orderItem);
  }

  updateOrderItem(orderItem: OrderItem): Observable<void> {
    return this._http.put<void>(`${this._url}/${orderItem.orderItemId}`, orderItem);
  }
}
