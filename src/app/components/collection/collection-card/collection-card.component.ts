import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Collection } from '../../../models/collection';
import { CollectionList} from '../collection-list/collection-list.component';

@Component({
  selector: 'app-collection-card',
  imports: [],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.css'
})
export class CollectionCard {

  private _router = inject(Router);

  @Input('collection') collection!: Collection;
  @Output("deleteCollection") deleteCollection = new EventEmitter<{ id: number }>();


  onDelete() {
    console.log(this.collection.collectionId)
    this.deleteCollection.emit({ id: this.collection.collectionId });
  }


  onUpdate() {
    this._router.navigate(['/edit-Collection-form', this.collection.collectionId]);
  }

}
