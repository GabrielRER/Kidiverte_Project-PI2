import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {
  abaAtiva: string = 'dados';
  usuario: User | null = null;
  editando: boolean = false;
  carregando: boolean = false;
  sucesso: string = '';
  erro: string = '';
  generos = ['Masculino', 'Feminino', 'Não-binário', 'Prefiro não informar'];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = this.authService.getCurrentUser();
  }

  selecionarAba(aba: string): void {
    this.abaAtiva = aba;
    this.editando = false;
    this.sucesso = '';
    this.erro = '';
  }

  toggleEdicao(): void {
    this.editando = !this.editando;
  }

  salvarDados(): void {
    if (!this.usuario) return;

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    this.userService.updateUser(this.usuario.id, {
      name: this.usuario.name,
      surname: this.usuario.surname,
      email: this.usuario.email,
      gender: this.usuario.gender,
      cpf: this.usuario.cpf,
      phone: this.usuario.phone,
      birthDate: this.usuario.birthDate
    }).subscribe({
      next: (usuarioAtualizado) => {
        this.carregando = false;
        this.usuario = usuarioAtualizado;
        this.editando = false;
        this.sucesso = 'Dados atualizados com sucesso!';
        setTimeout(() => this.sucesso = '', 3000);
      },
      error: (err) => {
        this.carregando = false;
        this.erro = 'Erro ao atualizar dados. Tente novamente.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  maskCPF(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    if (this.usuario) this.usuario.cpf = v;
    input.value = v;
  }

  maskPhone(event: Event): void {
    const input = event.target as HTMLInputElement;
    let v = input.value.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    if (this.usuario) this.usuario.phone = v;
    input.value = v;
  }
}
