import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Collection } from '../../../models/collection';
import { User } from '../../../models/user';
import { DataService } from '../../../service/dataService';
import { CategoryService } from '../../../service/categoryService';
import { Category } from '../../../models/category';
import { UserService } from '../../../service/userService';

@Component({
  selector: 'app-collection-card',
  imports: [RouterLink],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css'
})
export class CollectionCardComponent {
  currentUser!: User;
  private _dataService = inject(DataService);
  private _router = inject(Router);
  private _catService = inject(CategoryService);
  private _userService = inject(UserService);
  category!: Category;
  owner!: User;

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

}
