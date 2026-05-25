import { Routes } from '@angular/router';
import { PlpComponent } from './Components/plp/plp';

export const routes: Routes = [
  {
    path: '',
    component: PlpComponent
  },
  {
    path: 'pdp/:id',
    loadComponent: () =>
      import('./Components/plp/plp').then(m => m.PlpComponent)
  }
];