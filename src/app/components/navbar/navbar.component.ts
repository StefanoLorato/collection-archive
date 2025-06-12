import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DataService } from '../../service/dataService';
import { User } from '../../models/user';
import { AuthService } from '../../service/authService';
import { CategoryService } from '../../service/categoryService';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-navbar',
  imports: [RouterModule, RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private _dataService = inject(DataService);
  currentUser: User | null = null;
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _catService = inject(CategoryService);
  list: Category[] = [];
  icon!: string;
  private scrollInterval: any;


  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

startScroll(direction: number) {
  if (!this.scrollContainer) return; // evita errori
  this.stopScroll();

  this.scrollInterval = setInterval(() => {
    this.scrollContainer.nativeElement.scrollBy({ left: 10 * direction, behavior: 'smooth' });
  }, 45);
}

  stopScroll() {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
      this.scrollInterval = null;
    }
  }

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

  iconMap: { [key: number]: string } = {
  1: 'bi-globe-americas',
  2: 'bi-brush',
  3: 'bi-truck',
  4: 'bi-collection',
  5: 'bi-house',
  6: 'bi-lightbulb',
  7: 'bi-book',
  8: 'bi-controller',
  9: 'bi-gem',
  10: 'bi-journal-bookmark',
  11: 'bi-person-bounding-box',
  12: 'bi-currency-bitcoin',
  13: 'bi-music-note-beamed',
  14: 'bi-film',
  15: 'bi-camera',
  16: 'bi-watch'
};
}