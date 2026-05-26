import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './Components/shared/footer/footer';
import { Header } from './Components/shared/header/header';
import { CartSidebar } from "./Components/cart-sidebar/cart-sidebar";
import { PlpComponent } from './Components/plp/plp';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  Footer, Header, CartSidebar, PlpComponent],
  templateUrl: './app.html'
})
export class App {protected readonly title = signal('kidiverteProject');

  sidebarAberta = false;

  abrirSidebar() { this.sidebarAberta = true; }
  fecharSidebar() { this.sidebarAberta = false; }}