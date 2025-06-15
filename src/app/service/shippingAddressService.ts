import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ShippingAddress } from "../models/shippingAddress";

@Injectable({
  providedIn: 'root'
})
export class ShippingAddressService {
  list: ShippingAddress[] = [];
  private _url: string = "http://localhost:8080/api/shippingAddresses"
  private _http = inject(HttpClient)

  getAddresses(): Observable<ShippingAddress[]> {
    return this._http.get<ShippingAddress[]>(this._url);
  }

  deleteAddress(id: number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  getAddressById(id: number): Observable<ShippingAddress> {
    return this._http.get<ShippingAddress>(`${this._url}/${id}`);
  }

  addAddress(address: Partial<ShippingAddress>): Observable<ShippingAddress> {
    return this._http.post<ShippingAddress>(this._url, address);
  }

  updateAddress(address: ShippingAddress): Observable<void> {
    return this._http.put<void>(`${this._url}/${address.shippingId}`, address);
  }

  getAddressesByUSerId(userId: number): Observable<ShippingAddress[]> {
    return this._http.get<ShippingAddress[]>(`${this._url}/user/${userId}`);
  }
}
