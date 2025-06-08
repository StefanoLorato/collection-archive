import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../service/itemService';
import { Item } from '../../../models/item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-item-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  item: Item | undefined;

  private _service = inject(ItemService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._service.getItemById(+id).subscribe({
        next: (data) => this.item = data,
        error: () => {
          alert('Errore nel caricamento dell\'item');
          this._router.navigate(['/collection-list']);
        }
      });
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.item) return;

    this._service.updateItem(this.item).subscribe({
      next: () => {
        alert('Update Item With Success');
        this._router.navigate(['/collection-detail', this.item!.collection]);
      },
      error: () => alert('Errore durante la modifica dell\'item')
    });
  }
}
