import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Card } from './Components/shared/card/card';
import { ProductDetail } from './Components/product-detail/product-detail';
import { Shopping } from './Components/shopping/shopping';
import { PlpComponent } from './Components/plp/plp';
import { Payment } from './Components/payment/payment';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'payment', component: Payment },
  { path: 'home', component: Home },
  { path: 'card', component: Card },
  { path: 'produto/:id', component: ProductDetail },
  { path: 'shopping', component: Shopping },
  { path: '', component: PlpComponent},
  {path: 'pdp/:id', loadComponent: () =>
      import('./Components/plp/plp').then(m => m.PlpComponent)},
  { path: 'carrinho', component: Shopping },
  { path: 'plp', component: PlpComponent },
  { path: 'pdp/:id', component: ProductDetail },
  { path: 'produto/:id', component: ProductDetail }

];
