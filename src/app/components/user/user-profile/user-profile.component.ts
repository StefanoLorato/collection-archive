import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../service/userService';
import { User } from '../../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionCardComponent } from '../../collection/collection-card/collection-card.component';
import { CollectionService } from '../../../service/collectionService';
import { Collection } from '../../../models/collection';
import { CollectionListComponent } from '../../collection/collection-lists/collection-list.component';
import { DataService } from '../../../service/dataService';

@Component({
  selector: 'app-user-profile',
  imports: [CollectionCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
  owner!: User;
  currentUser!: User;
  private _userService = inject(UserService);
  private _collectionService = inject(CollectionService)
  private _route = inject(ActivatedRoute);
  private _dataService = inject(DataService);
  private _userId!: number;
  list: Collection[] = [];

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");
    if (id != null) {
      this._userId = +id; //potevo fare anche Number(id) per rendere la string un number
      if (this._userId != 0 && !isNaN(this._userId)) {
        this.findUser(this._userId);
        this._dataService.selectedUserObservable.subscribe(loggedUser => {
          if (loggedUser != null) {
            if (loggedUser.userId === this._userId) {
              this.loadMyCollections();
            } else {
              this.loadCollections(this._userId);
            }
          }
        });
      } else {
        alert("id non valido");
      }
    }
  }

  handleDelete(obj: { id: number }) {
    console.log(obj.id)
    this._collectionService.deleteCollection(obj.id).subscribe({
      next: () => {
        this.list = this.list.filter((c) => c.collectionId != obj.id);
        alert("La collection è stata eliminata con successo");
      },
      error: e => {
        alert("Errore nell cancellazione della colleciton");
        this.loadMyCollections();
      }
    })
  }

  findUser(id: number){
    this._userService.getUserById(id).subscribe({
      next: u => this.owner = u,
      error: e => alert("errore nel caricamento dell'user: " + e)
    })
  }

  loadCollections(id: number){
    this._collectionService.getCollectionsByUserId(id).subscribe({
        next: collections => this.list = collections,
        error: e => alert("Errore nel caricamento delle collezioni " + e)
    });
  }

  loadMyCollections() {
    this._collectionService.getLoggedUserCollections().subscribe({
      next: collections => this.list = collections,
      error: e => alert("Errore di caricamento delle collections " + e)
    });
  }
}
