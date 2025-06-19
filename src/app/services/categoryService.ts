import { inject, Injectable } from "@angular/core";
import { Item } from "../models/item";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Category } from "../models/category";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  list: Category[] = [];
  private _url: string = "http://localhost:8080/api/categories"
  private _http = inject(HttpClient)

  getCategories(): Observable<Category[]> {
      return this._http.get<Category[]>(this._url);
  }

  deleteCategory(id: number): Observable<void> {
      return this._http.delete<void>(`${this._url}/${id}`);

  }

  getCategoryById(id: number): Observable<Category> {
      return this._http.get<Category>(`${this._url}/${id}`);
  }

  addCategory(category: Partial<Category>): Observable<Category> {
      return this._http.post<Category>(this._url, category);
  }

  updateCategory(category: Category): Observable<void> {
      return this._http.put<void>(`${this._url}/${category.categoryId}`, category);
  }
}
