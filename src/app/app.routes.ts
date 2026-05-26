import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Card } from './Components/shared/card/card';
import { ProductDetail } from './Components/product-detail/product-detail';
import { Shopping } from './Components/shopping/shopping';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'card', component: Card },
  { path: 'produto/:id', component: ProductDetail },
  { path: 'carrinho', component: Shopping },
];