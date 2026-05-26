import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Card } from './Components/shared/card/card';
import { ProductDetail } from './Components/product-detail/product-detail';
import { Shopping } from './Components/shopping/shopping';
import { PlpComponent } from './Components/plp/plp';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'card', component: Card },
  { path: 'carrinho', component: Shopping },
  { path: 'plp', component: PlpComponent },
  { path: 'pdp/:id', component: ProductDetail },
  { path: 'produto/:id', component: ProductDetail } 
];