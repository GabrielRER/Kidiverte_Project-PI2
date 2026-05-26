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
  produtos: Product[] = [];
  produtosFiltrados: Product[] = [];
  quantidadeVisivel: number = 9; 
  precoMax: number = 1000;

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
    this.productService.getProducts().subscribe({
      next: (dados) => {
        this.produtos = dados;

        this.route.queryParams.subscribe(params => {
          this.categoriasSelecionadas = [];
          this.marcasSelecionadas = [];

          if (params['categoria']) {
            this.categoriasSelecionadas.push(Number(params['categoria']));
          }

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

          this.aplicarFiltros(); 
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
    // Se não tiver nenhum filtro selecionado, exibe tudo
    if (
      this.categoriasSelecionadas.length === 0 &&
      this.marcasSelecionadas.length === 0 &&
      this.idadesSelecionadas.length === 0 &&
      this.generosSelecionados.length === 0
    ) {
      this.produtosFiltrados = [...this.produtos];
      return;
    }

    // Filtra baseado nas propriedades exatas do db.json
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