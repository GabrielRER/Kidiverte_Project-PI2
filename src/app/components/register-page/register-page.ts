import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
})
export class RegisterPage {

  form = {
    nome: '',
    sobrenome: '',
    email: '',
    genero: '',
    cpf: '',
    telefone: '',
    nascimento: '',
    senha: ''
  };

  saved = false;
  isLoading = false;
  errorMessage = '';

  generos = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  maskCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    this.form.cpf = v;
    input.value = v;
  }

  maskPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    this.form.telefone = v;
    input.value = v;
  }

  onSubmit(): void {
    if (!this.form.email || !this.form.senha || !this.form.nome) {
      this.errorMessage = 'Por favor, preencha os campos obrigatórios';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const fullName = `${this.form.nome} ${this.form.sobrenome}`.trim();

    this.authService.register(fullName, this.form.email, this.form.senha).subscribe({
      next: () => {
        this.isLoading = false;
        this.saved = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erro ao registrar usuário';
      }
    });
  }
}

