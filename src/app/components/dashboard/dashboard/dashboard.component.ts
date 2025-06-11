import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../service/authService';
import { UserService } from '../../../service/userService';

@Component({
  selector: 'app-dashboard',
  standalone: true, // <-- NECESSARIO
  imports: [CommonModule, RouterLink], // <-- CommonModule per *ngFor / *ngIf
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  collection!: Collection | any;
  list: Collection[] = [];
  private _service = inject(CollectionService);
  private _authService = inject(UserService);
  currentUserId!: number;

  ngOnInit(): void {
    this.loadAllCollection();
  }

  handleDelete(obj: { id: number }) {
    console.log(obj.id);
    this._service.deleteCollection(obj.id).subscribe({
      next: () => {
        this.list = this.list.filter((c) => c.collectionId != obj.id);
        alert("La collection è stata eliminata con successo");
      },
      error: e => {
        alert("Errore nella cancellazione della collection");
        this.loadAllCollection();
      }
    });
  }

  loadAllCollection() {
    const toDoObservable: Observable<Collection[]> = this._service.getCollections();
    toDoObservable.subscribe({
      next: collections => this.list = collections,
      error: e => alert("Errore di caricamento della collection " + e)
    });
  }
}
