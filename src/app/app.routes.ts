import { Routes } from '@angular/router';
import { SearchComponent } from './features/search/search.component';
import { GifDetailComponent } from './features/gif-detail/gif-detail.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'gif/:id', component: GifDetailComponent }
];
