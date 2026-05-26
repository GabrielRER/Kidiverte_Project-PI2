import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']

})
export class ProfilePage {
  abaAtiva: string = 'dados';

  selecionarAba(aba: string): void {
    this.abaAtiva = aba;
  }
}
