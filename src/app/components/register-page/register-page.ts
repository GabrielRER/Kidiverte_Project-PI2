import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  generos = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar'];

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
    this.saved = true;
    setTimeout(() => (this.saved = false), 2500);
  }
}
