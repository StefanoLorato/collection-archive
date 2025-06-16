import { Component, inject } from '@angular/core';
import { User } from '../../models/user';
import { DataService } from '../../service/dataService';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private _dataService = inject(DataService);
  currentUser!: User;


  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if (user != null) {
        this.currentUser = user;
      }
    });
  }

}
