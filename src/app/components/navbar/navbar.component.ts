import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../service/dataService';
import { User } from '../../models/user';
import { AuthService } from '../../service/authService';
import { CategoryService } from '../../service/categoryService';
import { Category } from '../../models/category';
import { CommonModule, ɵnormalizeQueryParams } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchTerm: String = '';
  private _dataService = inject(DataService);
  currentUser: User | null = null;
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _catService = inject(CategoryService);
  list: Category[] = [];

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(
      user => this.currentUser = user
    )
    this.loadCategories();
  }

  loadCategories(){
    this._catService.getCategories().subscribe({
      next: categories => this.list = categories,
      error: err => alert("Errore nella ricerca delle categorie" + err)
    })
  }

  logout(){
    this._authService.logout();
    alert("You succesfully logged out. Thank you for your visit");
    this._router.navigate(['/login']);
  }

  search(){
    this._router.navigate(['/collection-list'], {queryParams: {collectionName : this.searchTerm}});
  }
}
