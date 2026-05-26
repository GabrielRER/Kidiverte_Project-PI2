import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Output() abrirCarrinho = new EventEmitter<void>();

  abrirCartSidebar() {
    console.log('Botão clicado');
    this.abrirCarrinho.emit();
  }
}
