import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Card } from '../shared/card/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plp',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './plp.html',
  styleUrl: './plp.css'
})
export class PlpComponent implements OnInit {

  // Lista completa de produtos vindos do service
  produtos: Product[] = [];

  // Lista após aplicação dos filtros
  produtosFiltrados: Product[] = [];

  // Controla quantos produtos aparecem na tela
  quantidadeVisivel: number = 9; 

  // Valor máximo do slider de preço
  precoMax: number = 1000;

  // Arrays que guardam os filtros selecionados
  categoriasSelecionadas: number[] = [];
  generosSelecionados: number[] = [];
  idadesSelecionadas: number[] = [];
  marcasSelecionadas: number[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Busca os produtos no backend
    this.productService.getProducts().subscribe({
      next: (dados) => {
        this.produtos = dados;

        // Observa mudanças na URL
        this.route.queryParams.subscribe(params => {

          // Reseta os filtros antes de aplicar novos
          this.categoriasSelecionadas = [];
          this.marcasSelecionadas = [];

          // Se vier categoria na URL, adiciona no filtro
          if (params['categoria']) {
            this.categoriasSelecionadas.push(Number(params['categoria']));
          }

          // Converte nome da marca (URL) para ID interno
          if (params['marca']) {
            const mapaMarcas: { [key: string]: number } = {
              'Lego': 1, 'Hasbro': 2, 'Mattel': 3, 'Bandai': 4, 
              'Melissa & Doug': 5, 'Funko': 6, 'Pokémon': 7, 'Roblox': 8, 'Candide': 9
            };
            
            const idMarca = mapaMarcas[params['marca']];
            if (idMarca) {
              this.marcasSelecionadas.push(idMarca);
            }
          }

          // Aplica os filtros após leitura dos parâmetros
          this.aplicarFiltros(); 

          // atualização da tela
          this.cdr.detectChanges(); 
        });
      },
      error: (err) => console.error('Erro ao buscar produtos:', err)
    });
  }

  toggleFiltro(lista: any[], valor: any, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      lista.push(valor);
    } else {
      const index = lista.indexOf(valor);
      if (index > -1) {
        lista.splice(index, 1);
      }
    }
    this.aplicarFiltros();
  }

  onPrecoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.precoMax = Number(input.value);
    this.aplicarFiltros();
  }

  verMais(): void {
    this.quantidadeVisivel += 9;
  }

  aplicarFiltros(): void {
    
    this.produtosFiltrados = this.produtos.filter(produto => {
      
      
      const passaCategoria = this.categoriasSelecionadas.length === 0 || 
                             this.categoriasSelecionadas.includes(produto.category_id);

      
      const passaGenero = this.generosSelecionados.length === 0 || 
                          this.generosSelecionados.includes(produto.gender_id);

      
      const passaIdade = this.idadesSelecionadas.length === 0 || 
                         this.idadesSelecionadas.includes(produto.age_range_id);

      
      const passaMarca = this.marcasSelecionadas.length === 0 || 
                         this.marcasSelecionadas.includes(produto.brand_id);

      
      const passaPreco = produto.current_price <= this.precoMax;

      
      return passaCategoria && passaGenero && passaIdade && passaMarca && passaPreco;
    });
  }
}