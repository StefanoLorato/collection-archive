import { Component, OnInit, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from '../../../service/itemService';
import { Item } from '../../../models/item';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';

@Component({
  selector: 'app-item-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css']
})
export class ItemEditComponent implements OnInit {
  item!: Item;
  collections: Collection[] = [];

  private _service = inject(ItemService);
  private _collectionService = inject(CollectionService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) {
      this._service.getItemById(+id).subscribe({
        next: (data) => this.item = data,
        error: () => {
          alert('Error during get item Id');
          this._router.navigate(['/collection-list']);
        }
      });
    }
    this.loadMyCollections();
  }

  onSubmit(form: NgForm) {
    if (form.invalid || !this.item) return;

    this._service.updateItem(this.item).subscribe({
      next: () => {
        this._router.navigate(['/collection-detail', this.item!.collectionId]);
      },
      error: () => alert('Error during update items')
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.item.itemPhoto = reader.result as string; // salva come base64
      };
      reader.readAsDataURL(file);
    }
  }

  loadMyCollections() {
    this._collectionService.getLoggedUserCollections().subscribe({
      next: c => this.collections = c,
      error: e => alert("Errore di caricamento delle collections " + e)
    });
  }

}
