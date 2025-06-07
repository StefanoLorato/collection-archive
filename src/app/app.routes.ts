import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CollectionListComponent } from './components/collection/collection-lists/collection-list.component';
import { CollectionFormComponent } from './components/collection/collection-forms/collection-form.component';

export const routes: Routes = [
     { path: '', redirectTo: 'collection-list', pathMatch: 'full' },
     { path: 'home', component: HomeComponent },
     { path: 'collection-list', component: CollectionListComponent },
     { path: 'collection-form', component: CollectionFormComponent },
];
