import { Component, inject, OnInit } from '@angular/core';
import { Item } from '../../../models/item';

import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ItemCardComponent } from '../item-card/item-card.component';
import { ItemService } from '../../../services/itemService';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent  implements OnInit{
  item!: Item;
  collectionId! : number;
  list: Item[] = [];
  private _service = inject(ItemService);
  private _route = inject(ActivatedRoute);

ngOnInit(): void {
    this._route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.collectionId = +id;
        this.loadItem();
      }
    });
  }



  handleUpdate(obj: { id: number}) {
    const item = this.findItemById(obj.id);
    console.log('handleDelete chiamato con id:',obj.id);
    if(item != null){
      this._service.updateItem(item).subscribe({
        next: ()=> {
            alert("item modificato");
            this.loadItem();
        },
        error: e =>alert("Errore nel modifica dell item " + e)
      });
    }
  }

 loadItem() {
  this._service.getItemsByCollectionId(this.collectionId).subscribe({
    next: items => this.list = items,
    error: e => alert("Errore nel caricamento degli item " + e)
  });
}

  findItemById(id:number) {
    this._service.getItemById(id).subscribe({
      next: t => {
        this.item = t;
        return this.item
      },
      error: e => alert("Errore nella ricerca dell'item")
    });
  }

}
