// Importações do Angular Core e utilitários necessários
import { inject } from '@angular/core';
import { CartService } from '../../services/cart.service';           // Serviço do carrinho de compras
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';                    // Lê o parâmetro de ID da URL
import { ProductService, Product } from '../../services/product.service'; // Serviço e interface de produto

// Decorador que define este componente — standalone: false pois pertence a um NgModule
@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {

  // Estado principal do componente
  product: Product | null = null; // Produto carregado da API (null enquanto carrega)
  loading = true;                 // Controla exibição do spinner de carregamento
  error = false;                  // Controla exibição da tela de erro
  quantity = 1;                   // Quantidade selecionada pelo usuário
  selectedImageIndex = 0;         // Índice da imagem atualmente exibida na galeria
  activeTab = 'description';      // Aba ativa na seção de tabs (description/specs/reviews)
  addedToCart = false;            // Controla o feedback visual do botão "Adicionar ao Carrinho"

  // Injeção do CartService via inject() (forma moderna do Angular)
  private cartService = inject(CartService);

  // Mapa local de ID → nome de categoria (substitui chamada à API de categorias)
  private categories: Record<number, string> = {
    1: 'Carrinhos',
    2: 'Blocos de Montar',
    3: 'Bonecas',
    4: 'Jogos',
    5: 'Esportes'
  };

  // Mapa local de ID → nome de marca
  private brands: Record<number, string> = {
    1: 'LEGO',
    2: 'Mattel',
    3: 'Candide',
    4: 'Hasbro',
    5: 'Estrela'
  };

  // Mapa local de ID → faixa etária
  private ageRanges: Record<number, string> = {
    1: '0-2 anos',
    2: '3-5 anos',
    3: '6-10 anos',
    4: '11-14 anos',
    5: '14+ anos'
  };

  // Injeção via construtor (forma tradicional):
  // - ActivatedRoute: acessa os parâmetros da URL (ex: /product/5 → id = 5)
  // - ProductService: faz a chamada HTTP para buscar os produtos
  // - ChangeDetectorRef: força a atualização da view após mudanças assíncronas
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  // Ciclo de vida: executado ao inicializar o componente
  ngOnInit(): void {
    // Escuta mudanças nos parâmetros da rota (ex: navegar de produto 1 para produto 2)
    this.route.paramMap.subscribe(params => {
      this.loading = true;
      this.error = false;

      // Obtém o ID do produto da URL e converte para número
      const id = Number(params.get('id'));

      // Chama o serviço para buscar todos os produtos e filtra pelo ID
      this.productService.getProducts().subscribe({
        next: (products) => {
          // Encontra o produto com o ID correspondente ou define null
          this.product = products.find(p => Number(p.id) === id) || null;
          this.loading = false;
          if (!this.product) this.error = true; // Produto não encontrado → exibe erro
          this.cdr.detectChanges(); // Força atualização da view
        },
        error: (err) => {
          console.error('Erro API:', err);
          this.loading = false;
          this.error = true;
          this.cdr.detectChanges();
        }
      });
    });
  }

  // Getter: retorna a lista de imagens do produto para a galeria
  // Prioridade: array de imagens → thumbnail → placeholder padrão
  get displayImages(): string[] {
    if (!this.product) return [];
    if (this.product.images && this.product.images.length > 0) {
      return this.product.images;
    }
    if (this.product.thumbnail_url) {
      return [this.product.thumbnail_url];
    }
    return ['assets/placeholder.png'];
  }

  // Getter: resolve o nome da categoria a partir do ID do produto
  get categoryName(): string {
    return this.product ? (this.categories[this.product.category_id] || 'Brinquedo') : '';
  }

  // Getter: resolve o nome da marca a partir do ID do produto
  get brandName(): string {
    return this.product ? (this.brands[this.product.brand_id] || 'Marca') : '';
  }

  // Getter: resolve a faixa etária a partir do ID do produto
  get ageRangeName(): string {
    return this.product ? (this.ageRanges[this.product.age_range_id] || '') : '';
  }

  // Getter: verifica se o produto possui desconto ativo
  get hasDiscount(): boolean {
    return !!(this.product?.discount_percentage && this.product.discount_percentage > 0);
  }

  // Getter: verifica se o produto está disponível em estoque
  get isInStock(): boolean {
    return !!(this.product && this.product.stock > 0);
  }

  // Getter: retorna mensagem de status do estoque com base na quantidade disponível
  get stockStatus(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'Esgotado';
    if (this.product.stock <= 5) return `Últimas ${this.product.stock} unidades!`; // Alerta de baixo estoque
    return 'Em estoque';
  }

  // Getter: calcula o valor economizado com o desconto (preço original - preço atual)
  get savings(): number {
    if (!this.product?.original_price || !this.product?.current_price) return 0;
    return this.product.original_price - this.product.current_price;
  }

  // Incrementa a quantidade, respeitando o limite máximo do estoque
  incrementQty(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  // Decrementa a quantidade, com mínimo de 1
  decrementQty(): void {
    if (this.quantity > 1) this.quantity--;
  }

  // Troca a imagem principal ao clicar em uma miniatura da galeria
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  // Troca a aba ativa na seção de descrição/especificações/avaliações
  setTab(tab: string): void {
    this.activeTab = tab;
  }

  // Adiciona o produto ao carrinho pela quantidade selecionada
  // Após adicionar, exibe feedback "✅ Adicionado!" por 2,5 segundos
  addToCart(): void {
    if (this.product) {
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.adicionarItem(this.product); // Chama o serviço do carrinho
      }
      this.addedToCart = true;
      setTimeout(() => (this.addedToCart = false), 2500); // Reseta o feedback após 2.5s
    }
  }

  // Formata um número para o padrão monetário brasileiro (R$ 00,00)
  // Retorna '-' caso o valor seja nulo
  formatPrice(value: number | null): string {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // Recebe a nova nota emitida pelo componente filho app-star-rate
  // e atualiza o rating do produto atual
  atualizarNotaProduto(novaNota: number): void {
    if (this.product) {
      this.product.rating = novaNota;
    }
  }
}