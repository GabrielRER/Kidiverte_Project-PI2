import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itens = signal<CartItem[]>([]);
  public freteSelecionado: any = null;

  itensCarrinho = this.itens.asReadonly();

  totalItens = computed(() =>
    this.itens().reduce((acc, item) => acc + item.quantidade, 0)
  );

  totalPreco = computed(() =>
    this.itens().reduce((acc, item) => acc + item.product.current_price * item.quantidade, 0)
  );

  adicionarItem(produto: Product): void {
    const atual = this.itens();
    const existente = atual.find(i => i.product.id === produto.id);

    if (existente) {
      this.itens.set(atual.map(i =>
        i.product.id === produto.id
          ? { ...i, quantidade: i.quantidade + 1 }
          : i
      ));
    } else {
      this.itens.set([...atual, { product: produto, quantidade: 1 }]);
    }
  }

  removerItem(produtoId: number): void {
    this.itens.set(this.itens().filter(i => i.product.id !== produtoId));
  }

  aumentarQuantidade(produtoId: number): void {
    this.itens.set(this.itens().map(i =>
      i.product.id === produtoId
        ? { ...i, quantidade: i.quantidade + 1 }
        : i
    ));
  }

  diminuirQuantidade(produtoId: number): void {
    this.itens.set(this.itens().map(i =>
      i.product.id === produtoId && i.quantidade > 1
        ? { ...i, quantidade: i.quantidade - 1 }
        : i
    ).filter(i => i.quantidade > 0));
  }

  limparCarrinho(): void {
    this.itens.set([]);
  }

  // Método inserido corretamente dentro do escopo da classe
  obterProdutosParaFrete(): any[] {
    return this.itensCarrinho().map(item => ({
      id: String(item.product.id),
      width: Number(item.product.width || 11),
      height: Number(item.product.height || 2),
      length: Number(item.product.length || 16),
      weight: Number(item.product.weight || 0.1),
      insurance_value: Number(item.product.current_price),
      quantity: Number(item.quantidade)
    }));
  }
}