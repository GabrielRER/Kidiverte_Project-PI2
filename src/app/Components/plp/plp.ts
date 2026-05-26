import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

type Produto = {
  id: number;
  nome: string;
  preco: number;
  img: string;
};

@Component({
  selector: 'app-plp',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plp.html',
  styleUrls: ['./plp.css']
})
export class PlpComponent implements OnInit {

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];

  quantidadeVisivel: number = 12;
  precoMax: number = 5000;

  ngOnInit(): void {
    this.gerarProdutos();
    this.aplicarFiltro();
  }

  gerarProdutos(): void {
    const base: Produto[] = [
      {
        id: 1,
        nome: 'Carrinho Hot Wheels',
        preco: 30,
        img: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        nome: 'Lego Minecraft',
        preco: 280,
        img: 'https://via.placeholder.com/150'
      }
    ];

    this.produtos = [...base];

    while (this.produtos.length < 38) {
      const copia = this.produtos.map((p, index) => ({
        ...p,
        id: this.produtos.length + index + 1
      }));
      this.produtos.push(...copia);
    }

    this.produtos = this.produtos.slice(0, 38);
  }

  aplicarFiltro(): void {
    this.produtosFiltrados = this.produtos.filter(
      p => p.preco <= this.precoMax
    );
  }

  verMais(): void {
    this.quantidadeVisivel += 12;
  }

 onPrecoChange(event: Event): void {
  const value = (event.target as HTMLInputElement).value;
  this.precoMax = Number(value);

  this.quantidadeVisivel = 12; // mantém comportamento correto

  this.aplicarFiltro();
}
}