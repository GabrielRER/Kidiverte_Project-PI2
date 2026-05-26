import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service'; // importa a lógica do carrinho

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.css',
})
export class CartSidebar {
  @Output() fechar = new EventEmitter<void>(); //cria um evento (EventEmitter) chamado fechar e envia o aviso ao componente pai (outPut)

  cartService: CartService = inject(CartService); // da acesso ao cartService 

  fecharSidebar() {  
    this.fechar.emit(); // envia o evento com o emit.
  }

  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    // define como o valor deve aparecer 
  }
}