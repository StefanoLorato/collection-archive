import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Item } from '../../../models/item';

@Component({
  selector: 'app-item-card',
  imports: [],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css'
})
export class ItemCardComponent {
  private _router = inject(Router)

  @Input('item') item!: Item;
  @Output('deleteItem') deleteItem = new EventEmitter<{id: number}>();

  onDelete(){
    this.deleteItem.emit({ id: this.item.itemId });
  }

  onUpdate() {
    this._router.navigate(['/item-edit', this.item.itemId]);
  }

}
