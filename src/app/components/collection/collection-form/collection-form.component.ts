import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CollectionService } from '../../../service/collectionService'; // supponiamo esista

@Component({
  selector: 'app-collection-form',
  imports: [ReactiveFormsModule],
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.css']
})
export class CollectionFormComponent {
  private _service = inject(CollectionService);
  private _router = inject(Router);
  formBuilder = inject(FormBuilder);
  collectionForm: FormGroup;

  constructor() {
    this.collectionForm = this.formBuilder.group({
      collectionName: ['', Validators.required],
      completed: [false],
      categoryId: ['', Validators.required],
      visibility: ['', Validators.required],
      description: [''],
      collectionDate: [''],
      forSale: [false],
      salePrice: [''],
      userId:[3],
    });
  }

  onSubmit() {
    if (this.collectionForm.invalid) return;

    return this._service.createCollection(this.collectionForm.value).subscribe({
      next: () => {
        alert("Collezione aggiunta!");
        this._router.navigate(['/collection-list']);
      },
      error: err => alert("Errore durante il salvataggio")
    });
  }

  // Getter per i campi del form (facilita il binding nel template)
  get collectionName() { return this.collectionForm.get('collectionName'); }
  get description() { return this.collectionForm.get('description'); }
  get collectionDate() { return this.collectionForm.get('collectionDate'); }
  get categoryId() { return this.collectionForm.get('categoryId'); }
  get salePrice() { return this.collectionForm.get('salePrice'); }
}
