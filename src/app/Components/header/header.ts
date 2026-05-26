import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {@Output() abrirCarrinho = new EventEmitter<void>();

abrirCartSidebar() {
  this.abrirCarrinho.emit();
}}
