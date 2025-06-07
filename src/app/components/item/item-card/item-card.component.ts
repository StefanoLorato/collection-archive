import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '../../../models/item';

@Component({
  selector: 'app-item-card',
  imports: [],
  templateUrl: './item-card.html',
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
    this._router.navigate(['/edit-item-form', this.item.itemId]);
  }

}
