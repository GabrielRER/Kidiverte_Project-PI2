// Importações necessárias do Angular Core
import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  @Output() abrirCarrinho = new EventEmitter<void>();

  constructor(
    public router: Router,
    public authService: AuthService
  ) {}

  abrirCartSidebar() {
    console.log('Botão clicado');
    this.abrirCarrinho.emit();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  navigateProfile(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/profile']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}