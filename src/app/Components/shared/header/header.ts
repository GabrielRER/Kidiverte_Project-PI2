// Importações necessárias do Angular Core
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// - Output: marca uma propriedade como saída do componente (evento para o pai)
// - EventEmitter: objeto que dispara eventos customizados entre componentes

@Component({
  selector: 'app-header',   // Tag usada para inserir o header: <app-header>
  standalone: true,         // Componente independente, sem precisar de NgModule
  imports: [CommonModule, RouterModule],  // Importar CommonModule para usar ngClass
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  // @Output declara um evento que este componente filho pode emitir para o componente pai.
  // O pai escuta com: <app-header (abrirCarrinho)="minhaFuncao()">
  @Output() abrirCarrinho = new EventEmitter<void>();
  // EventEmitter<void> indica que o evento não carrega nenhum dado — é só um sinal

  constructor(public router: Router) {}

  // Método chamado quando o usuário clica no ícone do carrinho no template
  // Ele emite o evento 'abrirCarrinho' para que o componente pai
  // saiba que deve abrir o sidebar do carrinho
  abrirCartSidebar() {
    console.log('Botão clicado'); // Log de debug para confirmar o clique
    this.abrirCarrinho.emit();    // Dispara o evento para o componente pai
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}