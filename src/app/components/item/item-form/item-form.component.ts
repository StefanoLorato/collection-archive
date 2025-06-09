import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Item } from '../../../models/item';
import { ItemService } from '../../../service/itemService';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-form-template',
  imports: [FormsModule,CommonModule],
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {
  item: Partial<Item> = {
    itemName: '',
    itemDescription: '',
    itemPhoto: '',
    forSale: false,
    visibilityStatus: ''
  };

  private _service = inject(ItemService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _isUpdate = false;

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id != null) {
      this._isUpdate = true;
      const itemId = Number(id);
      if (itemId > 0 && !isNaN(itemId)) {
        this.findItem(itemId);
      } else {
        alert('Mi devi dare un numero maggiore di 0');
      }
    }
  }

  onSubmit(f: NgForm) {
    if (f.invalid) return;

    if (!this._isUpdate) {
      this._service.addItem(this.item).subscribe({
        next: s => {
          alert('Item salvato con id ' + s.itemId);
          this._router.navigate(['/item-list']);
        },
        error: e => alert('Errore nella creazione dell\'item')
      });
    } else {
      this._service.updateItem(this.item as Item).subscribe({
        next: s => {
          alert('Item aggiornato con id ' + this.item.itemId);
          console.log(this.item.collection);
          this._router.navigate(['/collection-detail', this.item.collection]);
        },
        error: e => alert('Errore nella modifica dell\'item')
      });
    }
  }

findItem(id: number) {
  this._service.getItemById(id).subscribe({
    next: i => this.item = i,
    error: e => {
      console.error('Errore nel caricamento dell\'item:', e);
      alert('Errore nel caricamento dell\'item');
    }
  });
}
}
