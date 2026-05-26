import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service'; 
import { ShippingCalculator } from '../shared/shipping-calculator/shipping-calculator';

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, ShippingCalculator],
  templateUrl: './shopping.html',
  styleUrl: './shopping.css',
})
export class Shopping implements OnInit {

  public cartService: CartService;
  private router: Router;
  private http: HttpClient;

  codigoCupom: string = '';
  mensagemCupom: string = '';
  descontoCupom: number = 0;

  constructor(
    _cartService: CartService,
    _router: Router,
    _http: HttpClient
  ) {
    this.cartService = _cartService;
    this.router = _router;
    this.http = _http;
  }

  ngOnInit(): void {
    this.cartService.freteSelecionado = null;
  }
  
  get subtotal(): number {
    return this.cartService.itensCarrinho().reduce(
      (acc, item) => acc + item.product.current_price * item.quantidade, 0
    );
  }

  get total(): number {
    let valorFrete = 0;
    
    if (this.cartService.freteSelecionado && this.cartService.freteSelecionado.preco) {
      const precoLimpo = String(this.cartService.freteSelecionado.preco).replace(',', '.');
      valorFrete = parseFloat(precoLimpo);
    }
    return Number(this.subtotal) + (isNaN(valorFrete) ? 0 : valorFrete) - Number(this.descontoCupom);
  }

  get opcaoFreteSelecionada(): any {
    return this.cartService.freteSelecionado;
  }

  get carrinhoVazio(): boolean {
    return this.cartService.itensCarrinho().length === 0;
  }

  aplicarCupom(): void {
    const cuponsValidos: { [key: string]: number } = {
      'KIDIVERTE10': 0.10,
      'DESCONTO20': 0.20,
    };
    const codigo = this.codigoCupom.trim().toUpperCase();
    if (cuponsValidos[codigo]) {
      this.descontoCupom = this.subtotal * cuponsValidos[codigo];
      this.mensagemCupom = `Cupom aplicado! ${cuponsValidos[codigo] * 100}% de desconto.`;
    } else {
      this.descontoCupom = 0;
      this.mensagemCupom = 'Cupom inválido.';
    }
  }

  formatarMoeda(valor: number): string {
    if (valor == null) return 'R$ 0,00';
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarFretePreco(preco: string): string {
    if (!preco) return '0,00';
    return parseFloat(preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  imagemProduto(item: any): string {
    return item.product.images?.[0] ?? 'assets/placeholder.png';
  }

  finalizarCompra(): void {
    this.router.navigate(['/checkout']);
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }
}