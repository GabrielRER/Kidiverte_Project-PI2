import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartSidebar } from './Components/cart-sidebar/cart-sidebar';
import { Header } from './Components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartSidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'

})
export class App {
  protected readonly title = signal('kidiverteProject');
 sidebarAberta = false;

  abrirSidebar() {
    this.sidebarAberta = true;
  }

  fecharSidebar() {
    this.sidebarAberta = false;
  }
}
