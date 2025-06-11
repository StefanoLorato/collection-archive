import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Item } from '../../../models/item';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';

@Component({
  selector: 'app-item-card',
  imports: [],
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.css'
})
export class ItemCardComponent implements OnInit{
  private _router = inject(Router);
  private _dataService = inject(DataService);
  currentUser!: User;

  @Input('item') item!: Item;
  @Output('deleteItem') deleteItem = new EventEmitter<{id: number}>();

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if(user != null){
        this.currentUser = user;
      }
    });
  }

  onDelete(){
    console.log('onDelete chiamato! itemId:', this.item.itemId);
    this.deleteItem.emit({ id: this.item.itemId });
  }

  onUpdate() {
    this._router.navigate(['/item-edit', this.item.itemId]);
  }

  test(e: any) {
    console.log('Evento ricevuto dal figlio:', e);
  }

}
