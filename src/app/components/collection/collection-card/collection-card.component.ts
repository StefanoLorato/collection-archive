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
import { UserLike } from '../../../models/userLike';
import { UserLikeService } from '../../../service/userLikeService';
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../../service/bookmarkService';
import { Bookmark } from '../../../models/bookmark';

@Component({
  selector: 'app-collection-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css'
})
export class CollectionCardComponent {
  private _bookmarkService = inject(BookmarkService);
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
  like!: UserLike;

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
    this.like = {
      userId: this.currentUser.userId,
      collectionId: this.collection.collectionId
    };
    if(!this.collection.liked){
      this._likeService.addLike(this.like).subscribe({
        next: (savedLike) => {
          this.collection = {...this.collection, liked: !this.collection.liked, likeId: savedLike.likeId!};
          alert("Like aggiunto");
        },
        error: err => alert("Errore nell'aggiunta del like: " + err)
      });
    } else {
      this._likeService.deleteLike(this.collection.likeId!).subscribe({
        next: () => {
          this.collection = {...this.collection, liked: !this.collection.liked, likeId: null};
          alert("Like rimosso");
        },
        error: err => alert("Errore nella rimozione del like: " + err)
      });
    }
  }
  comment(){
  }
  addBookmark(){
    const bookmark : Bookmark= {
      userId: this.currentUser.userId,
      collectionId: this.collection.collectionId,
    }
    this._bookmarkService.createBookmark(bookmark).subscribe({
      next: b => alert("bookmark aggiunto con id: " + b.bookmarkId),
      error: err => alert("errore nell'aggiunta del bookmark" + err)
    })
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
