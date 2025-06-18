import { Component, inject } from '@angular/core';
import { User } from '../../models/user';
import { DataService } from '../../service/dataService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private _dataService = inject(DataService);
  currentUser!: User;
  private _router = inject(Router);


  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if (user != null) {
        this.currentUser = user;
      }
    });
  }

  directToDashboard(){
    this._router.navigate(['/dashboard']);
  }

}
