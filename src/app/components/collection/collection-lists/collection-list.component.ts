import { Component, inject } from '@angular/core';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { Observable } from 'rxjs';
import { CollectionCardComponent } from '../collection-card/collection-card.component';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../service/categoryService';
import { Category } from '../../../models/category';

type Filters = {
  collectionName?: string;
  categoryId?: number;
  userId?: number;
  salePrice?: number;
  priceComparation?: string;
};

@Component({
  selector: 'app-collection-list',
  imports: [CollectionCardComponent],
  templateUrl: './collection-list.component.html',
  styleUrl: './collection-list.component.css'
})
export class CollectionListComponent {
  collection!: Collection;
  list: Collection[] = [];
  private _service = inject(CollectionService);
  private _route = inject(ActivatedRoute);
  private _catService = inject(CategoryService);
  category!: Category | null;

  ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => {
      const filters: Filters = {
        collectionName: params.get('collectionName') || undefined,
        categoryId: params.get('categoryId') ? +params.get('categoryId')! : undefined,
        userId: params.get('userId') ? +params.get('userId')! : undefined,
        salePrice: params.get('salePrice') ? +params.get('salePrice')! : undefined,
        priceComparation: params.get('priceComparation') || undefined
      };
      this.loadCollections(filters);
      if(filters.categoryId){
        this.findCategoryById(filters.categoryId);
      }
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

  loadCollections(filters?: Filters){
    if (filters?.categoryId == null){
      this.category = null;
    }    
    this._service.getCollections(filters).subscribe({
       next: collections => this.list = collections,
       error: e => alert("Errore di caricamento della collection " + e)
    });
  }

  handleDelete(obj: { id: number }) {
    console.log(obj.id);
    this._service.deleteCollection(obj.id).subscribe({
      next: () => {
        this.list = this.list.filter((c) => c.collectionId != obj.id);
        alert("La collection è stata eliminata con successo");
      },
      error: e => {
        alert("Errore nella cancellazione della collection");
        this.loadCollections();
      }
    });
  }

  findCategoryById(id: number){
    this._catService.getCategoryById(id).subscribe({
      next: c => this.category = c,
      error: err => alert("Errore di caricamento della collection " + err)
    })
  }
}
