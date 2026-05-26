import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { Footer } from './Components/shared/footer/footer';
import { Header } from './Components/shared/header/header';
import { StarRate } from "./Components/shared/star-rate/star-rate";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
=======
import { Footer } from './Components/footer/footer';
import { Header } from './Components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Footer, Header],
>>>>>>> cartsidebar
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly title = signal('kidiverteProject');
}
