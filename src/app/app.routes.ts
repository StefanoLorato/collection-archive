import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CollectionListComponent } from './components/collection/collection-lists/collection-list.component';
import { CollectionFormComponent } from './components/collection/collection-form/collection-form.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { CollectionDetailComponent } from './components/collection/collection-detail/collection-detail.component';

export const routes: Routes = [
     { path: '', redirectTo: 'collection-list', pathMatch: 'full' },
     { path: 'home', component: HomeComponent },
     { path: 'collection-list', component: CollectionListComponent },
     { path: 'collection-form', component: CollectionFormComponent },
     { path: 'item-list', component: ItemListComponent},
     { path: 'collection-detail/:id', component: CollectionDetailComponent},

];
