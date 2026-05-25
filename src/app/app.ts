import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Plp } from './Components/plp/plp';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Plp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('kidiverteProject');
}
