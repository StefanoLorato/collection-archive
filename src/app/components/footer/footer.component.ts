import { Component } from '@angular/core';
import { FooterColumnComponent } from "../footer-column/footer-column.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [FooterColumnComponent, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
  export class FooterComponent {
 infoLinks = ['About RareBlu','Our Experts','Careers','Press','Partner with Us'];
  buyLinks = ['How to Buy','Buyer Protection','RareBlu Stories','Buyer Terms'];
  sellLinks = ['How to Sell','Selling Tips','Category Guidelines','Seller Terms', 'Affiliation Program'];
  rareBluLinks = ['Register', 'Login In'];
}
