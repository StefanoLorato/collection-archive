import { Component, inject } from '@angular/core';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { Observable } from 'rxjs';
import { CollectionCardComponent } from '../collection-card/collection-card.component';

@Component({
  selector: 'app-collection-list',
  imports: [CollectionCardComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css'
})
export class CollectionListComponent {
  collection!: Collection | any;
  list: Collection[] = [];
  private _service = inject(CollectionService);

  ngOnInit(): void {
    this.loadMyCollection();
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
        this.loadMyCollection();
      }
    })
  }

  loadMyCollection() {
    const toDoObservable: Observable<Collection[]> = this._service.getLoggedUserCollections();
    toDoObservable.subscribe({
      next: collections => this.list = collections,
      error: e => alert("Errore di caricamento della collection " + e)
    });
  }

  findCollectionById(id: number) {
    this._service.getCollectionById(id).subscribe({
      next: c => {
        console.log(c);
        this.collection = c;
      },
      error: () => alert("Errore nella ricerca del Collection id")
    });
  }
}
