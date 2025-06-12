import { Component, inject } from '@angular/core';
import { DataService } from '../../service/dataService';
import { User } from '../../models/user';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private _dataService = inject(DataService);
  user!: User;


  ngOnInit(): void {
    this._dataService.selectedUserObservable.subscribe(user => {
      if (user != null) {
        this.user = user;
      }
    });
  }

}
