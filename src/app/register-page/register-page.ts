import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css']
  
})
export class RegisterPage {
abaAtiva: string = 'dados';

  selecionarAba(aba: string): void {
    this.abaAtiva = aba;
  }
}
