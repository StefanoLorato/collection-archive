import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home-component';
import { ItemListComponent } from './components/item/item-list/item-list';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent},
    { path: 'item-list', component: ItemListComponent},
    ];
