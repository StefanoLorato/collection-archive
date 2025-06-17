import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Collection } from '../../../models/collection';
import { User } from '../../../models/user';
import { DataService } from '../../../service/dataService';
import { CategoryService } from '../../../service/categoryService';
import { Category } from '../../../models/category';
import { UserService } from '../../../service/userService';
import { ItemService } from '../../../service/itemService';
import { Item } from '../../../models/item';
import { UserLikeService } from '../../../service/userLikeService';
import { UserLike } from '../../../models/userLike';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-card',
  imports: [RouterLink,CommonModule],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css'
})
export class CollectionCardComponent {
  private _dataService = inject(DataService);
  private _router = inject(Router);
  private _catService = inject(CategoryService);
  private _userService = inject(UserService);
  private _itemService = inject(ItemService);
  private _likeService = inject(UserLikeService);

  currentUser!: User;
  category!: Category | null;
  owner!: User | null;
  list: Item[] = [];
  showFullDescription = false;
  isLongDescription = false;
  hasTags = false;
  liked = false;
  likeId?:number;
 

  @Input('collection') collection!: Collection;
  @Output("deleteCollection") deleteCollection = new EventEmitter<{ id: number }>();

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
    this.findCategoryById(this.collection.categoryId);
    this.findUserById(this.collection.userId);
    this.loadItem(this.collection.collectionId);
    this.isLongDescription = this.collection.description.length > 120;
    const stored = localStorage.getItem(`liked_${this.collection.collectionId}`);
  this.liked = stored === 'true';
   this._likeService.getLikesByUserId(this.currentUser.userId).subscribe({
  next: (likes) => {
    const foundLike = likes.find(l => l.collectionId === this.collection.collectionId);
    if (foundLike) {
      this.liked = true;
      this.likeId = foundLike.likeId;
    }
  }
});
    
  }

  onDelete() {
    console.log(this.collection.collectionId)
    this.deleteCollection.emit({ id: this.collection.collectionId });
  }

  onUpdate() {
    if (this.collection?.collectionId) {
      this._router.navigate(['/edit-collection-form', this.collection.collectionId]);
    } else {
      alert('Collection ID non valido!');
    }
  }

  findCategoryById(id: number){
    this._catService.getCategoryById(id).subscribe({
      next: category => this.category = category,
      error: err => alert("categoria non trovata" + err)
    })
  }

  findUserById(id: number){
    this._userService.getUserById(id).subscribe({
      next: user => this.owner = user,
      error: err => alert("user non trovato" + err)
    })
  }

  
  toggleLike() {
  if (!this.liked) {
    // Se non è già piaciuta, creiamo un nuovo like
    const like: UserLike = {
      userId: this.currentUser.userId,
      collectionId: this.collection.collectionId
    };
    this._likeService.addLike(like).subscribe({
      next: (savedLike) => {
        this.liked = true;
        this.likeId = savedLike.likeId;   // Salviamo l’id per poter cancellare
        alert("Like aggiunto");
      },
      error: err => alert("Errore nell'aggiunta del like: " + err)
    });
  } else {
    // Se è già piaciuta, rimuoviamo il like usando likeId
    if (!this.likeId) {
      alert("Errore: likeId non trovato per la rimozione");
      return;
    }
    this._likeService.deleteLike(this.likeId).subscribe({
      next: () => {
        this.liked = false;
        this.likeId = undefined;
        alert("Like rimosso");
      },
      error: err => alert("Errore nella rimozione del like: " + err)
    });
  }
}
  
  comment(){
  }
  bookmark(){
  }

    loadItem(id: number) {
    this._itemService.getItemsByCollectionId(id).subscribe({
      next: items => this.list = items,
      error: e => alert("Errore nel caricamento dell'item " + e)
    });
  }

  toggleDescription() {
    this.showFullDescription = !this.showFullDescription;
  }
}
