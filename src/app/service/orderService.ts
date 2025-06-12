import { inject, Injectable } from "@angular/core";
import { Item } from "../models/item";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Order } from "../models/order";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  list: Item[] = [];
  private _url: string = "http://localhost:8080/api/orders"
  private _http = inject(HttpClient)

  getItems(): Observable<Order[]> {
    return this._http.get<Order[]>(this._url);
  }

  getItemById(id: number): Observable<Order> {
    return this._http.get<Order>(`${this._url}/${id}`);
  }

  deleteItem(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);

  }

  addItem(order: Partial<Order>): Observable<Order> {
    return this._http.post<Order>(this._url, order);
  }

  updateItem(order: Order): Observable<void> {
    return this._http.put<void>(`${this._url}/${order.orderId}`, order);
  }
}
