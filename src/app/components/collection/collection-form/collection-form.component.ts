import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../../service/collectionService'; // supponiamo esista
import { Collection } from '../../../models/collection';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';

@Component({
  selector: 'app-collection-form',
  imports: [ReactiveFormsModule],
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.css']
})
export class CollectionFormComponent {
  private _service = inject(CollectionService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  collectionForm: FormGroup;
  collectionId!: Collection;
  private _isUpdate = false;
  private _dataService = inject(DataService);
  user: User | null = null;


  constructor() {
    this.collectionForm = this.formBuilder.group({
      collectionId : [],
      collectionName: ['', Validators.required],
      completed: [false],
      categoryId: ['', Validators.required],
      visibility: ['', Validators.required],
      description: [''],
      collectionDate: [''],
      forSale: [false],
      salePrice: [''],
      userId: [this.user?.userId],
    });
  }

   ngOnInit(): void {
   this._dataService.selectedUserObservable.subscribe(user => {
    this.user = user
    if (this.user) {
      this.collectionForm.patchValue({
        userId: this.user.userId
      });
      console.log("Utente caricato:", this.user);
    } else {
      console.warn("Nessun utente disponibile nel DataService.");
    }
    });

    console.log("userid" + this.user?.userId);
    const id = this._route.snapshot.paramMap.get("id");
    if (id != null && id != undefined) {
      this._isUpdate = true;
      const collectiontId = Number(id)
      if (collectiontId > 0 && !isNaN(collectiontId)) {
        this.findCollection(collectiontId);
      } else {
        alert("Mi devi dare un numero maggiore di 0")
      }
    }
  }

  onSubmit() {
    console.log(this.collectionForm.value);
    if (this.collectionForm.invalid) return;
    if (!this._isUpdate) {
      return this._service.createCollection(this.collectionForm.value).subscribe({
        next: () => {
          alert("Collezione aggiunta!");
          this._router.navigate(['/collection-list']);
        },
        error: err => alert("Errore durante il salvataggio")
      });
    } else {
     return this._service.updateCollection(this.collectionForm.value).subscribe({
        next: () => {
          alert("Collezione aggiornata!");
          this._router.navigate(['/collection-list']);
        },
        error: err => alert("Error during update's collection")
      });
    }
  }

findCollection(id: number) {
  this._service.getCollectionById(id).subscribe({
    next: data => {
      this.collectionForm.patchValue({
        collectionId: data.collectionId,
        collectionName: data.collectionName,
        completed: data.completed,
        categoryId: data.categoryId,
        visibility: data.visibility,
        description: data.description,
        collectionDate: data.collectionDate,
        forSale: data.forSale,
        salePrice: data.salePrice,
        userId: data.userId ,
      });
    },
    error: () => {
      alert('Errore nel recupero dei dati');
      this._router.navigate(['/collection-list']);
    }
  });
}

  get collectionName() { return this.collectionForm.get('collectionName'); }
  get description() { return this.collectionForm.get('description'); }
  get collectionDate() { return this.collectionForm.get('collectionDate'); }
  get categoryId() { return this.collectionForm.get('categoryId'); }
  get salePrice() { return this.collectionForm.get('salePrice'); }
}
