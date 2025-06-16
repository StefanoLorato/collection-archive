import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Item } from '../../../models/item';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';

import { Collection } from '../../../models/collection';
import { UserService } from '../../../services/userService';
import { CollectionService } from '../../../services/collectionService';


@Component({
  selector: 'app-item-card',
  imports: [RouterLink],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css'
})
export class ItemCardComponent implements OnInit{
  private _router = inject(Router);
  private _dataService = inject(DataService);
  currentUser!: User;
  private _userService = inject(UserService);
  private _collectionService = inject(CollectionService);
  owner!: User | null;
  collection!: Collection | null;

  @Input('item') item!: Item;
  @Output('deleteItem') deleteItem = new EventEmitter<{id: number}>();

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
    this.findUserById(this.item.userId);
    this.findCollectionById(this.item.collectionId);
  }

  onDelete(){
    console.log('onDelete chiamato! itemId:', this.item.itemId);
    this.deleteItem.emit({ id: this.item.itemId });
    console.log("componente interna invia l'evento");

  }

  onUpdate() {
    this._router.navigate(['/item-edit', this.item.itemId]);
  }

  test(e: any) {
    console.log('Evento ricevuto dal figlio:', e);
  }

  findUserById(id: number){
    this._userService.getUserById(id).subscribe({
      next: user => this.owner = user,
      error: err => alert("user non trovato" + err)
    })
  }

  findCollectionById(id: number){
    this._collectionService.getCollectionById(id).subscribe({
      next: collection => this.collection = collection,
      error: err => alert("collezione non trovata" + err)
    })
  }

}
