import { Component, inject } from '@angular/core';
<<<<<<< HEAD
import { DataService } from '../../service/dataService';
import { User } from '../../models/user';
=======
import { User } from '../../models/user';
import { DataService } from '../../service/dataService';
>>>>>>> master

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
