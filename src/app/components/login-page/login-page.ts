import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
    FormsModule
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  form = {
    email: '',
    senha: ''
  };

  erro: string = '';
  carregando: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.form.email || !this.form.senha) {
      this.erro = 'Por favor, preencha todos os campos';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.authService.login(this.form.email, this.form.senha).subscribe({
      next: (user) => {
        this.carregando = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.carregando = false;
        this.erro = 'Email ou senha inválidos';
      }
    });
  }
}

