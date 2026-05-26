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
}