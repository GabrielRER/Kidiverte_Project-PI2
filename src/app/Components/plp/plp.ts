import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Card } from '../shared/card/card'; 
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-plp',
  standalone: true,
  imports: [CommonModule, RouterModule, Card], 
  templateUrl: './plp.html',
  styleUrls: ['./plp.css']
})
export class PlpComponent implements OnInit {

  produtos: Product[] = [];
  produtosFiltrados: Product[] = [];

  quantidadeVisivel: number = 12;
  precoMax: number = 1000;

  categoriasSelecionadas: number[] = [];
  generosSelecionados: number[] = [];
  idadesSelecionadas: number[] = [];  
  marcasSelecionadas: number[] = [];  

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.carregarProdutosReais();
  }

  carregarProdutosReais(): void {
    this.productService.getProducts().subscribe({
      next: (dados) => {
        this.produtos = dados;
        this.aplicarFiltro();
      },
      error: (err) => {
        console.error('Erro ao buscar produtos do servidor:', err);
      }
    });
  }

  toggleFiltro(lista: number[], id: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    
    if (checkbox.checked) {
      lista.push(id);
    } else {
      const index = lista.indexOf(id);
      if (index > -1) lista.splice(index, 1);
    }

    this.quantidadeVisivel = 12;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    this.produtosFiltrados = this.produtos.filter(p => {
      const batePreco = p.current_price <= this.precoMax;

      const bateCategoria = this.categoriasSelecionadas.length === 0 || 
                             this.categoriasSelecionadas.includes(p.category_id);

      const bateGenero = this.generosSelecionados.length === 0 || 
                          this.generosSelecionados.includes(p.gender_id);

      const bateIdade = this.idadesSelecionadas.length === 0 || 
                        this.idadesSelecionadas.includes(p.age_range_id);

      const bateMarca = this.marcasSelecionadas.length === 0 || 
                        this.marcasSelecionadas.includes(p.brand_id);

      return batePreco && bateCategoria && bateGenero && bateIdade && bateMarca;
    });
  }

  verMais(): void {
    this.quantidadeVisivel += 12;
  }

  onPrecoChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.precoMax = Number(value);
    this.quantidadeVisivel = 12;
    this.aplicarFiltro();
  }
}