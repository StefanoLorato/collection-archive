import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class TodoService {
    list: [] = [];
    private _url: string = "http://localhost:8080/api/todos"
    private _http = inject(HttpClient)
    // constructor() {
    //     this.loadTodo();
    // }