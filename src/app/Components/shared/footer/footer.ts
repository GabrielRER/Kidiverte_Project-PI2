// Importação do decorator Component do Angular Core
import { Component } from '@angular/core';

// Decorator que define este arquivo como um componente Angular standalone
@Component({
  selector: 'app-footer',   // Tag usada para inserir o footer em outros templates: <app-footer>
  imports: [],              // Nenhuma dependência extra — o footer é puramente estático
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
// Classe vazia pois o footer não possui lógica dinâmica —
// todo o conteúdo é estático (links, imagens e textos fixos)
export class Footer {}