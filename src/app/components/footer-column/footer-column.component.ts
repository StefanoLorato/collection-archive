import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer-column',
  imports: [CommonModule],
  templateUrl: './footer-column.component.html',
  styleUrl: './footer-column.component.css'
})
export class FooterColumnComponent {
  @Input() title: string = '';
  @Input() links: string[] = [];
  @Input() route: string = '';

 

}
