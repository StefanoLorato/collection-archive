import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Collection } from '../../../models/collection';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { Category } from '../../../models/category';
import { CollectionService } from '../../../services/collectionService';
import { CategoryService } from '../../../services/categoryService';


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
   isUpdate = false;
  private _dataService = inject(DataService);
  private _catService = inject(CategoryService);
  showForm: boolean = true;
  formBuilder = inject(FormBuilder);
  collectionForm: FormGroup;
  collectionId!: Collection;
  user: User | null = null;
  list: Category[] = [];
  forSale: boolean = false;


  constructor() {
    this.collectionForm = this.formBuilder.group({
      collectionId: [],
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
      this.isUpdate = true;
      const collectiontId = Number(id)
      if (collectiontId > 0 && !isNaN(collectiontId)) {
        this.findCollection(collectiontId);
      } else {
        alert("Mi devi dare un numero maggiore di 0")
      }
    }
    this.loadCategories();
  }

  onSubmit() {
    console.log(this.collectionForm.value);


    if (this.collectionForm.invalid) return;
    if (!this.isUpdate) {
      return this._service.createCollection(this.collectionForm.value).subscribe({
        next: () => {
          alert("Collezione aggiunta!");
          if (this.user != null) {
            this._router.navigate(['/user-profile', this.user.userId]);
          }
        },
        error: err => alert("Errore durante il salvataggio")
      });
    } else {
      return this._service.updateCollection(this.collectionForm.value).subscribe({
        next: () => {
          alert("Collezione aggiornata!");
          if (this.user != null) {
            this._router.navigate(['/user-profile', this.user.userId]);
          }
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
          userId: data.userId,
        });
      },
      error: () => {
        alert('Errore nel recupero dei dati');
        this._router.navigate(['/collection-list']);
      }
    });
  }

  loadCategories() {
    this._catService.getCategories().subscribe({
      next: categories => this.list = categories,
      error: err => alert("Errore nella ricerca delle categorie" + err)
    })
  }
  
  get collectionName() { return this.collectionForm.get('collectionName'); }
  get description() { return this.collectionForm.get('description'); }
  get collectionDate() { return this.collectionForm.get('collectionDate'); }
  get categoryId() { return this.collectionForm.get('categoryId'); }
  get salePrice() { return this.collectionForm.get('salePrice'); }
}
