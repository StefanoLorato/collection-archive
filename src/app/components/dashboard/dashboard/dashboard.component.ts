import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Collection } from '../../../models/collection';
import { CollectionService } from '../../../service/collectionService';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../service/authService';
import { UserService } from '../../../service/userService';
import { DataService } from '../../../service/dataService';
import { User } from '../../../models/user';
import { CollectionCardComponent } from '../../collection/collection-card/collection-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CollectionCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  collection!: Collection;
  list: Collection[] = [];
  private _collectionService = inject(CollectionService);
  private _userService = inject(UserService);
  private _dataService = inject(DataService);
  currentUserId!: number;
  currentUser!: User;
  ownerUser!: User;

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe( user => {
        if(user!= null){
          this.currentUser = user
        }
      });
    this.loadAllCollection();
  }

  handleDelete(obj: { id: number }) {
    console.log(obj.id);
    this._collectionService.deleteCollection(obj.id).subscribe({
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
    const toDoObservable: Observable<Collection[]> = this._collectionService.getCollections();
    toDoObservable.subscribe({
      next: collections => this.list = collections,
      error: e => alert("Errore di caricamento della collection " + e)
    });
  }

  like(){
  }
  comment(){
  }
  bookmark(){
  }

  findUserById(id: number){
    this._userService.getUserById(id).subscribe({
      next: u => this.ownerUser = u,
      error: e => alert("errore nel caricamento dell'user: " + e)
    })
  }
}
