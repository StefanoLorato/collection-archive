import { Component, inject, OnInit } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../service/itemService';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [ItemCardComponent],
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

  handleDelete(obj:{ id: number }) {
    console.log(obj.id)
    console.log("ciao");

    this._service.deleteItem(obj.id).subscribe({
      next: () => {
        this.list = this.list.filter((i) => i.itemId != obj.id);
        alert("l'item è stato eliminato con successo");
      },
      error: e => {
        alert("Errore nell cancellazione");
        this.loadItem();
      }
    })
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
