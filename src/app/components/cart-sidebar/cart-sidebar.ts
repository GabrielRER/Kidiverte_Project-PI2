import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css',
})

export class CartSidebar {

  quantidade = 1;
  preco = 269.9;

  sidebarAberta = true;

  aumentarQuantidade() {
    this.quantidade++;
  }

  diminuirQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  fecharSidebar() {
    this.sidebarAberta = false;
  }

  abrirSidebar() {
    this.sidebarAberta = true;
  }

  get total() {
    return this.quantidade * this.preco;
  }

}