import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../service/dataService';
import { User } from '../../models/user';
import { AuthService } from '../../service/authService';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private _dataService = inject(DataService);
  currentUser: User | null = null;
  private _authService = inject(AuthService);
  private _router = inject(Router);

  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(
      user => this.currentUser = user
    )
  }

  logout(){
    this._authService.logout();
    this._dataService.clearUsers();
    alert("You succesfully logged out. Thank you for your visit");
    this._router.navigate(['/login']);
  }
}
