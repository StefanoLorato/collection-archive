import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from "./components/footer/footer.component";
import { AuthService } from './services/authService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected title = 'collection-archive';

  constructor(private authService: AuthService) {
  console.log('Token da app component:', this.authService.getToken());
}
}
