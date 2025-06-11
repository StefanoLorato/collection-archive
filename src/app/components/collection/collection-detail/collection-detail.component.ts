import { Component, inject, OnInit } from '@angular/core';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ItemCardComponent } from '../../item/item-card/item-card.component';
import { Item } from '../../../models/item';
import { ItemService } from '../../../service/itemService';
import { Observable } from 'rxjs';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';

@Component({
  selector: 'app-collection-detail',
  imports: [ItemCardComponent, RouterLink],
  templateUrl: './collection-detail.component.html',
  styleUrl: './collection-detail.component.css'
})
export class CollectionDetailComponent implements OnInit {
  collection!: Collection;
  private _route = inject(ActivatedRoute);
  private _service = inject(CollectionService);
  private _router = inject(Router);
  item!: Item;
  list: Item[] = [];
  private _itemService = inject(ItemService);
  private _dataService = inject(DataService);
  currentUser!: User;


  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
    const id = this._route.snapshot.paramMap.get("id");
    if (id != null) {
      const collectionId = +id; //potevo fare anche Number(id) per rendere la string un number
      if (collectionId != 0 && !isNaN(collectionId)) {
        this.findCollection(collectionId);
        this.loadItem(collectionId)
      } else {
        alert("id non valido");
      }
    }
  }

  loadItem(id: number) {
    const itemObservable: Observable<Item[]> = this._itemService.getItemsByCollectionId(id);
    itemObservable.subscribe({
      next: items => this.list = items,
      error: e => alert("Errore nel caricamento dell'item " + e)
    });
  }

  findCollection(id: number) {
    this._service.getCollectionById(id).subscribe({
      next: c => this.collection = c,
      error: e => alert("errore nel caricamento della collection: " + e)
    });
  }

  navigateToEdit() {
    this._router.navigate(['/collection-form', this.collection.collectionId])
  }

}
