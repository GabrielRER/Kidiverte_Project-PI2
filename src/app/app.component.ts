import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './Components/shared/footer/footer';
import { Header } from './Components/shared/header/header';
import { StarRate } from "./Components/shared/star-rate/star-rate";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly title = signal('kidiverteProject');
}
