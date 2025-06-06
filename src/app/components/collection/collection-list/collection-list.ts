import { Component, inject } from '@angular/core';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { Observable } from 'rxjs';
import { CollectionCard } from '../collection-card/collection-card';

@Component({
  selector: 'app-collection-list',
  imports: [CollectionCard],
  templateUrl: './collection-list.html',
  styleUrl: './collection-list.css'
})
export class CollectionList {

  collection!: Collection | any;
  list: Collection[] = [];
  private _service = inject(CollectionService);

  ngOnInit(): void {
    this.loadCollection();
  }

  handleDelete(obj: { id: number }) {
    console.log(obj.id)
    this._service.deleteCollection(obj.id).subscribe({
      next: () => {
        this.list = this.list.filter((c) => c.collectionId != obj.id);
        alert("La collection è stata eliminata con successo");
      },
      error: e => {
        alert("Errore nell cancellazione della colleciton");
        this.loadCollection();
      }
    })
  }


  loadCollection() { 
    const toDoObservable: Observable<Collection[]> = this._service.getCollections();
    toDoObservable.subscribe({
      next: collections => this.list = collections,
      error: e => alert("Errore di caricamento dei To Do " + e)
    });
  }

findCollectionById(id: number): Collection | any {
  this._service.getCollectionById(id).subscribe({
    next: c => {
      this.collection = c;
      return this.collection;
    },
    error: () => alert("Errore nella ricerca del Collection id")
  });
}
}
