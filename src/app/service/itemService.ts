import { inject, Injectable } from "@angular/core";
import { Item } from "../models/item";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  list: Item[] = [];
  private _url: string = "http://localhost:8080/api/items"
  private _http = inject(HttpClient)

  getItems(): Observable<Item[]> {
      return this._http.get<Item[]>(this._url);
  }

  deleteItem(id: number): Observable<void> {
      return this._http.delete<void>(`${this._url}/${id}`);

  }

  getItemById(id: number): Observable<Item> {
      return this._http.get<Item>(`${this._url}/${id}`);
  }


  addItem(item: Partial<Item>): Observable<Item> {
      return this._http.post<Item>(this._url, item);
  }

  updateItem(item: Item): Observable<void> {
      return this._http.put<void>(`${this._url}/${item.itemId}`, item);
  }

}
