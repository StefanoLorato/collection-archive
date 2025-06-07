import { Component, inject, OnInit } from '@angular/core';
import { Item } from '../../../models/item';
import { ItemService } from '../../../service/itemService';
import { Observable } from 'rxjs';
import { ItemCardComponent } from '../item-card/item-card';

@Component({
  selector: 'app-item-list',
  imports: [ItemCardComponent],
  templateUrl: './item-list.html',
  styleUrl: './item-list.css'
})
export class ItemListComponent  implements OnInit{
  item!: Item;
  list: Item[] = [];
  private _service = inject(ItemService);

  ngOnInit(): void {
    this.loadItem();
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
      next: t => this.item = t,
      error: e => alert("Errore nella ricerca dell'item")
    });
  }

}
