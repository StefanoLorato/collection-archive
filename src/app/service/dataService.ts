import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";

@Injectable({
    providedIn: "root"
})

export class DataService {
    private _selectedUserBehavior = new BehaviorSubject<User| null>(null);
    selectedUserObservable = this._selectedUserBehavior.asObservable();

    selectedUser(name: User) {
        this._selectedUserBehavior.next(name);
    }

    clearUsers() {
        this._selectedUserBehavior.next(null);
    }
}