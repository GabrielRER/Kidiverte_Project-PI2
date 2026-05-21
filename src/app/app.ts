import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartSidebar } from './components/cart-sidebar/cart-sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartSidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'

})
export class App {
  protected readonly title = signal('kidiverteProject');
}
