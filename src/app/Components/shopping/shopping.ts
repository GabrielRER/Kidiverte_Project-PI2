import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Produto {
  id: number;
  name: string;
  current_price: number;
  original_price: number | null;
  discount_percentage: number | null;
  installments: number | null;
  installment_value: number | null;
  interest_free: boolean;
  images: string[];
  stock: number;
}

interface ItemCarrinho {
  produto: Produto;
  quantidade: number;
}

@Component({
  selector: 'app-shopping',
  standalone: false, // NgModule style
  templateUrl: './shopping.html',
  styleUrl: './shopping.css',
})
export class Shopping implements OnInit {

  itensCarrinho: ItemCarrinho[] = [];

  codigoCupom: string = '';
  mensagemCupom: string = '';
  descontoCupom: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.itensCarrinho = JSON.parse(carrinhoSalvo);
    }
  }

  aumentar(item: ItemCarrinho): void {
    if (item.quantidade < item.produto.stock) {
      item.quantidade++;
      this.salvarCarrinho();
    }
  }

  diminuir(item: ItemCarrinho): void {
    if (item.quantidade > 1) {
      item.quantidade--;
      this.salvarCarrinho();
    }
  }

  remover(item: ItemCarrinho): void {
    this.itensCarrinho = this.itensCarrinho.filter(i => i !== item);
    this.salvarCarrinho();
  }

  get subtotal(): number {
    return this.itensCarrinho.reduce(
      (acc, item) => acc + item.produto.current_price * item.quantidade,
      0
    );
  }

  get total(): number {
    return this.subtotal - this.descontoCupom;
  }

  get carrinhoVazio(): boolean {
    return this.itensCarrinho.length === 0;
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
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  imagemProduto(item: ItemCarrinho): string {
    return item.produto.images?.[0] ?? 'assets/placeholder.png';
  }

  finalizarCompra(): void {
    this.router.navigate(['/checkout']);
  }

  continuarComprando(): void {
    this.router.navigate(['/']);
  }

  private salvarCarrinho(): void {
    localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
  }
}