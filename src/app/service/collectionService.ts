import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Collection } from "../models/collection";

@Injectable({
    providedIn: 'root'
})

export class CollectionService {
    list: Collection[] = [];
    private _url: string = "http://localhost:8080/api/collections"
    private _http = inject(HttpClient)

    getCollections(): Observable<Collection[]>{
        return this._http.get<Collection[]>(this._url);
    }

    deleteCollection(id:number): Observable<void>{
        return this._http.delete<void>(`${this._url}/${id}`);
    }

    getCollectionById(id:number): Observable<void>{
        return this._http.get<void>(`${this._url}/${id}`);
    }

    createCollection(collection: Partial<Collection>): Observable<Collection> {
        return this._http.post<Collection>(this._url, collection);
    }

    updateTodo(collection: Collection): Observable<void> {
        return this._http.put<void>(`${this._url}/${collection.collectionId}`, collection);
    }

}

