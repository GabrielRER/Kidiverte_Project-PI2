import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { ProductDetail } from './Components/product-detail/product-detail';
import { Shopping } from './Components/shopping/shopping';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'produto/:id', component: ProductDetail },
  { path: 'carrinho', component: Shopping },
];