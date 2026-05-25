import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css',
})
export class CartSidebar {
  quantidade = 1;
  preco = 269.9;

  @Output() fechar = new EventEmitter<void>();

  aumentarQuantidade() {
    this.quantidade++;
  }

  diminuirQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  fecharSidebar() {
    this.fechar.emit();
  }

  get total() {
    return this.quantidade * this.preco;
  }
}