import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { ProductDetail } from './Components/product-detail/product-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'produto/:id', component: ProductDetail }
];