import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home-component';
import { CollectionList } from './components/collection/collection-list/collection-list';
import { CollectionForm } from './components/collection/collection-form/collection-form';

export const routes: Routes = [
     { path: '', redirectTo: 'collection-list', pathMatch: 'full' },
     { path: 'home', component: HomeComponent},
     { path: 'collection-list', component: CollectionList },
     { path: 'collection-form', component:CollectionForm },
    ];
