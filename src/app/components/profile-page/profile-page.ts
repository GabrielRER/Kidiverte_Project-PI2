import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {
  abaAtiva: string = 'dados';
  currentUser: User | null = null;
  isEditing = false;
  isLoading = false;
  errorMessage = '';

  formData = {
    name: '',
    email: ''
  };

  get firstName(): string {
    return this.currentUser?.name?.split(' ')[0] || 'Visitante';
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.formData.name = this.currentUser.name;
    this.formData.email = this.currentUser.email;

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/login']);
      }
    });
  }

  selecionarAba(aba: string): void {
    this.abaAtiva = aba;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.currentUser) {
      this.formData.name = this.currentUser.name;
      this.formData.email = this.currentUser.email;
    }
  }

  salvarDados(): void {
    this.isLoading = true;
    this.errorMessage = '';

    setTimeout(() => {
      if (this.currentUser) {
        this.currentUser.name = this.formData.name;
        this.currentUser.email = this.formData.email;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
      this.isLoading = false;
      this.isEditing = false;
    }, 1000);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

