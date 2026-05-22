import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Card } from './Components/shared/card/card';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'card', component: Card }
];