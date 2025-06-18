import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { DataService } from '../../service/dataService';
import { User } from '../../models/user';
import { AuthService } from '../../service/authService';
import { CategoryService } from '../../service/categoryService';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, RouterLink, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, AfterViewInit {
  searchTerm: String = '';
  private _dataService = inject(DataService);
  currentUser: User | null = null;
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _catService = inject(CategoryService);
  private scrollInterval: any;

  list: Category[] = [];
  icon!: string;
  showModal = false;
  username!: User;
  isSticky = false;
  offset = 250;
  stickyHeight: number = 0;
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
  @ViewChild('outerScrollContainer', { static: false }) outerScrollContainer!: ElementRef;

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(
      user => this.currentUser = user
    )
    this.loadCategories();

  }
  ngAfterViewInit(): void {
    // this.offset = this.scrollContainer.nativeElement.offsetTop;
    // console.log(this.offset);
  }

  @HostListener('window:scroll', [])
onWindowScroll() {
  const scrollY = window.scrollY;
  this.isSticky = scrollY > this.offset;
  this.stickyHeight = this.outerScrollContainer.nativeElement.offsetHeight;
  console.log(this.stickyHeight);

}

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


  loadCategories() {
    this._catService.getCategories().subscribe({
      next: categories => this.list = categories,
      error: err => alert("Errore nella ricerca delle categorie" + err)
    })
  }

  logout() {
    this._authService.logout();
    alert("You succesfully logged out. Thank you for your visit");
    this._router.navigate(['/login']);
  }

  search() {
    this._router.navigate(['/collection-list'], { queryParams: { collectionName: this.searchTerm } });
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

  searchWithEnter() {
  if (this.searchTerm.trim()) {
    // implement your search logic here
    console.log('Searching for:', this.searchTerm);
  }
}


}
