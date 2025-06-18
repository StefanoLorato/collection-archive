import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WishList } from '../models/wishList'; // Assicurati che il modello esista!

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private _url: string = "http://localhost:8080/api/wishlist";
  private _http = inject(HttpClient);

  getWishListItemById(id: number): Observable<WishList> {
    return this._http.get<WishList>(`${this._url}/${id}`);
  }

  getAllWishList(): Observable<WishList[]> {
    return this._http.get<WishList[]>(this._url);
  }

  createWishListItem(dto: Partial<WishList>): Observable<WishList> {
    return this._http.post<WishList>(this._url, dto);
  }

  deleteWishListItem(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  updateWishListItem(id: number, dto: WishList): Observable<void> {
    return this._http.put<void>(`${this._url}/${id}`, dto);
  }
  getWishListByCollectionId(collectionId: number): Observable<WishList[]> {
  return this._http.get<WishList[]>(`${this._url}/collection/${collectionId}`);

  }
}
