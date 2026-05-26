import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  erro: string = '';
  carregando: boolean = false;
  generos = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar'];

  constructor(private authService: AuthService, private router: Router) {}

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
    if (!this.form.nome || !this.form.sobrenome || !this.form.email || !this.form.senha) {
      this.erro = 'Por favor, preencha todos os campos obrigatórios';
      return;
    }

    this.carregando = true;
    this.erro = '';

    this.authService.register({
      name: this.form.nome,
      surname: this.form.sobrenome,
      email: this.form.email,
      password: this.form.senha,
      gender: this.form.genero,
      cpf: this.form.cpf,
      phone: this.form.telefone,
      birthDate: this.form.nascimento
    }).subscribe({
      next: (user) => {
        this.carregando = false;
        this.saved = true;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err) => {
        this.carregando = false;
        this.erro = err.message || 'Erro ao cadastrar. Tente novamente.';
      }
    });
  }
}

