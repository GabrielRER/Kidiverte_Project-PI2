import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './Components/shared/footer/footer';
import { Header } from './Components/shared/header/header';
import { CartSidebar } from "./Components/cart-sidebar/cart-sidebar";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, CartSidebar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class App {
  protected readonly title = signal('kidiverteProject');

  sidebarAberta = false;

  abrirSidebar() {this.sidebarAberta = true;}

  fecharSidebar() {this.sidebarAberta = false;}
}
