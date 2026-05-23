import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
 
interface Product {
  id: number;
  name: string;
  description: string;
  original_price: number | null;
  current_price: number;
  discount_percentage: number | null;
  installments: number | null;
  installment_value: number | null;
  interest_free: boolean;
  category_id: number;
  brand_id: number;
  gender_id: number;
  age_range_id: number;
  featured: boolean;
  best_seller: boolean;
  thumbnail_url: string | null;
  images: string[];
  stock: number;
}
 
@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading = true;
  error = false;
  quantity = 1;
  selectedImageIndex = 0;
  activeTab = 'description';
  addedToCart = false;
 
  // Dados auxiliares para exibição
  private categories: Record<number, string> = {
    1: 'Carrinhos',
    2: 'Blocos de Montar',
    3: 'Bonecas',
    4: 'Jogos',
    5: 'Esportes'
  };
 
  private brands: Record<number, string> = {
    1: 'LEGO',
    2: 'Mattel',
    3: 'Candide',
    4: 'Hasbro',
    5: 'Estrela'
  };
 
  private ageRanges: Record<number, string> = {
    1: '0-2 anos',
    2: '3-5 anos',
    3: '6-10 anos',
    4: '11-14 anos',
    5: '14+ anos'
  };
 
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
 
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<{ products: Product[] }>('/db.json').subscribe({
      next: (data) => {
        this.product = data.products.find(p => p.id === id) || null;
        this.loading = false;
        if (!this.product) this.error = true;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }
 
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
 
  get categoryName(): string {
    return this.product ? (this.categories[this.product.category_id] || 'Brinquedo') : '';
  }
 
  get brandName(): string {
    return this.product ? (this.brands[this.product.brand_id] || 'Marca') : '';
  }
 
  get ageRangeName(): string {
    return this.product ? (this.ageRanges[this.product.age_range_id] || '') : '';
  }
 
  get hasDiscount(): boolean {
    return !!(this.product?.discount_percentage && this.product.discount_percentage > 0);
  }
 
  get isInStock(): boolean {
    return !!(this.product && this.product.stock > 0);
  }
 
  get stockStatus(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'Esgotado';
    if (this.product.stock <= 5) return `Últimas ${this.product.stock} unidades!`;
    return 'Em estoque';
  }
 
  get savings(): number {
    if (!this.product?.original_price || !this.product?.current_price) return 0;
    return this.product.original_price - this.product.current_price;
  }
 
  incrementQty(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }
 
  decrementQty(): void {
    if (this.quantity > 1) this.quantity--;
  }
 
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }
 
  setTab(tab: string): void {
    this.activeTab = tab;
  }
 
  addToCart(): void {
    this.addedToCart = true;
    // Aqui você pode integrar com seu CartService
    // this.cartService.add(this.product!, this.quantity);
    setTimeout(() => (this.addedToCart = false), 2500);
  }
 
  formatPrice(value: number | null): string {
    if (value == null) return '-';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}