import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlpComponent } from './Components/plp/plp';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PlpComponent],
  templateUrl: './app.html'
})
export class App {}