import { Component, inject, OnInit } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../service/itemService';
import { Observable } from 'rxjs';
import { ItemCardComponent } from '../item-card/item-card.component';

@Component({
  selector: 'app-item-list',
  imports: [ItemCardComponent],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent  implements OnInit{
  item!: Item;
  list: Item[] = [];
  private _service = inject(ItemService);

  ngOnInit(): void {
    this.loadItem();
  }

  handleDelete(obj:{ id: number }) {
    console.log(obj.id)
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
    const itemObservable: Observable<Item[]> = this._service.getItems();
    itemObservable.subscribe({
      next: items => this.list = items,
      error: e => alert("Errore nel caricamento dell'item " + e)
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
