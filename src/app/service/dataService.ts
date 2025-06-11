import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user";

@Injectable({
    providedIn: "root"
})
// export class DataService {
//     private _selectedUserBehavior = new BehaviorSubject<User| null>(null);
//     selectedUserObservable = this._selectedUserBehavior.asObservable();

//     selectedUser(name: User) {
//         this._selectedUserBehavior.next(name);
//     }

//     clearUsers() {
//         this._selectedUserBehavior.next(null);
//     }

// }

export class DataService {
  private _selectedUserBehavior: BehaviorSubject<User | null>;

  selectedUserObservable;

  constructor() {
    const savedUser = localStorage.getItem('loggedUser');
    this._selectedUserBehavior = new BehaviorSubject<User | null>(
      savedUser ? JSON.parse(savedUser) : null
    );
    this.selectedUserObservable = this._selectedUserBehavior.asObservable();
  }

  selectedUser(user: User) {
    this._selectedUserBehavior.next(user);
  }

  clearUsers() {
    this._selectedUserBehavior.next(null);
    localStorage.removeItem('loggedUser'); // importante: cancella anche qui
  }
}
