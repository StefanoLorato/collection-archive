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
import { CommonModule } from '@angular/common';
import { BookmarkService } from '../../../service/bookmarkService';
import { Bookmark } from '../../../models/bookmark';
import { UserLike } from '../../../models/userLike';
import { UserCommentService } from '../../../service/userCommentService';
import { UserComment } from '../../../models/userComment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-collection-card',
  imports: [RouterLink, CommonModule, FormsModule],
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
  private _commentService = inject(UserCommentService);


  currentUser!: User;
  category!: Category | null;
  owner!: User | null;
  list: Item[] = [];
  showFullDescription = false;
  isLongDescription = false;
  hasTags = false;
  like!: UserLike;
  bookmark!: Bookmark;
  showComment = false;
  createComment: string = ''

  @Input('collection') collection!: Collection;
  @Output("deleteCollection") deleteCollection = new EventEmitter<{ id: number }>();
  @Output("bookmarkChanged") bookmarkChanged = new EventEmitter<{id: number, bookmarked: boolean}>();

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
  isCommenting = false;
newCommentText = '';

comment() {
  this.isCommenting = !this.isCommenting;
}

submitComment() {
  const comment: UserComment = {
    userId: this.currentUser.userId,
    collectionId: this.collection.collectionId,
    comment: this.newCommentText,
    name: this.currentUser.name,
  };

  this._commentService.createComment(comment).subscribe({
    next: () => {
      alert("Commento aggiunto!");
      this.newCommentText = '';
      this.isCommenting = false;
    },
    error: err => alert("Errore nell'aggiunta del commento: " + err)
  });
}

  toggleBookmark(){
    this.bookmark = {
      userId: this.currentUser.userId,
      collectionId: this.collection.collectionId,
    }
    if(!this.collection.bookmarked){
      this._bookmarkService.createBookmark(this.bookmark).subscribe({
        next: b => {
          this.collection = {...this.collection, bookmarked: !this.collection.bookmarked, bookmarkId: b.bookmarkId!};
          alert("bookmark aggiunto");
          this.bookmarkChanged.emit({id: this.collection.collectionId, bookmarked: true});
        },
        error: err => alert("errore nell'aggiunta del bookmark" + err)
      })
    } else {
      this._bookmarkService.deleteBookmark(this.collection.bookmarkId!).subscribe({
        next: () => {
          this.collection = {...this.collection, bookmarked: !this.collection.bookmarked, bookmarkId: null};
          alert("bookmark rimosso");
          this.bookmarkChanged.emit({id: this.collection.collectionId, bookmarked: false});
        },
        error: err =>  alert("errore nella rimozione del bookmark" + err)
      })
    }
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
