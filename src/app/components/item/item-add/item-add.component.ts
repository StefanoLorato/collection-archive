import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../service/itemService';
import { Item } from '../../../models/item';
import { compileNgModule } from '@angular/compiler';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-item-add',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-add.component.html',
  styleUrls: ['./item-add.component.css']
})
export class ItemAddComponent implements OnInit {
  item: Partial<Item> = {
    itemName: '',
    itemDescription: '',
    itemPhoto: '',
    forSale: false,
    visibilityStatus: '',
    salePrice: ''

  };

  private _service = inject(ItemService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  ngOnInit(): void {
    const collectionId = this._route.snapshot.paramMap.get('collectionId');
    const userId = this._route.snapshot.paramMap.get('userId');

    if (collectionId) {
      this.item.collectionId = Number(collectionId);
    } else {
      alert('Miss Collection ID');
      this._router.navigate(['/collection-list']);
    }

    if (userId) {
      this.item.userId = Number(userId);
      console.log('UserId:', this.item.userId);
    } else {
      alert('Miss User Id');
    }
  }


  onSubmit(form: NgForm) {
    if (form.invalid) return;

    console.log('Payload da inviare:', this.item);

    this._service.addItem(this.item).subscribe({
      next: s => {
        alert('Item creato con ID: ' + s.itemId);
        this._router.navigate(['/collection-detail', this.item.collectionId]);
      },
      error: e => {
        console.error('Errore nella creazione item:', e);
      }
    });
  }
}
