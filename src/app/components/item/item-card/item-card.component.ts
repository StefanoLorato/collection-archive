import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Item } from '../../../models/item';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';

import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { UserLike } from '../../../models/userLike';
import { UserLikeService } from '../../../service/userLikeService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css'
})
export class ItemCardComponent implements OnInit{
  private _router = inject(Router);
  private _dataService = inject(DataService);
  private _userService = inject(UserService);
  private _collectionService = inject(CollectionService);
  private _likeService = inject(UserLikeService);
  currentUser!: User;
  owner!: User| null;
  collection!: Collection | null;
  like!: UserLike;

  @Input('item') item!: Item;
  @Output('deleteItem') deleteItem = new EventEmitter<{id: number}>();
  @Output('bookmarkChanged') bookmarkChanged = new EventEmitter<{id: number, bookmarked: boolean}>();

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
    this.findUserById(this.item.userId);
    if(this.item.collectionId){
      this.findCollectionById(this.item.collectionId);
    }
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

  toggleLike() {
    this.like = {
      userId: this.currentUser.userId,
      itemId: this.item.itemId
    };
    if(!this.item.liked){
      this._likeService.addLike(this.like).subscribe({
        next: (savedLike) => {
          if (!savedLike || savedLike.likeId == null) {
            alert("Errore: likeId mancante");
            return;
          }
          console.log(savedLike);

          this.item = {...this.item, liked: !this.item.liked, likeId: savedLike.likeId!, numLikes: this.item.numLikes+1};
          alert("Like aggiunto");
          console.log('Like aggiunto:', savedLike);
          console.log('Stato item:', this.item);
        },
        error: err => alert("Errore nell'aggiunta del like: " + err)
      });
    } else {
      this._likeService.deleteLike(this.item.likeId!).subscribe({
        next: () => {
          this.item = {...this.item, liked: !this.item.liked, likeId: null, numLikes: this.item.numLikes-1};
          alert("Like rimosso");
          console.log('Like rimosso:');
          console.log('Stato item:', this.item);
        },
        error: err => alert("Errore nella rimozione del like: " + err)
      });
    }
  }
  
  onBookmarkChange(event: { id: number, bookmarked: boolean }) {
    this.bookmarkChanged.emit({id: this.item.itemId, bookmarked: this.item.bookmarked});
  }

}
