import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Collection } from "../models/collection";

@Injectable({
    providedIn: 'root'
})

export class CollectionService {
    list: Collection[] = [];
    private _url: string = "http://localhost:8080/api/collections"
    private _http = inject(HttpClient)

    getCollections(filters?: {
        collectionName?: string;
        categoryId?: number;
        userId?: number;
        salePrice?: number;
        priceComparation?: string;
      }): Observable<Collection[]> {
        let params = new HttpParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              params = params.set(key, value.toString());
          }
        });
      }
        return this._http.get<Collection[]>(this._url, {params});
    }

    getCollectionsByUserId(userId: number): Observable<Collection[]> {
      return this.getCollections({ userId });
    }

    getCollectionByBookmarkUserId(): Observable<Collection[]> {
      let params = new HttpParams().set("bookmarked", true);
      return this._http.get<Collection[]>(this._url, {params});
    }

    getLoggedUserCollections(): Observable<Collection[]> {
        return this._http.get<Collection[]>(this._url + "/loggedUser");
    }

    deleteCollection(id: number): Observable<void> {
        return this._http.delete<void>(`${this._url}/${id}`);
    }

    getCollectionById(id: number): Observable<Collection> {
        return this._http.get<Collection>(`${this._url}/${id}`);
    }

    createCollection(collection: Partial<Collection>): Observable<Collection> {
        return this._http.post<Collection>(this._url, collection);
    }

    updateCollection(updateCollection: Collection): Observable<void> {
        return this._http.put<void>(`${this._url}/${updateCollection.collectionId}`, updateCollection);
    }

    toggleVisibility(id: number): Observable<void> {
        return this._http.put<void>(`${this._url}/${id}/visibility`, null);
    }

}

