import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';

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

interface FreteOpcao {
  id: number;
  nome: string;
  preco: string;
  prazo: number;
  logo: string;
}

@Component({
  selector: 'app-shopping',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './shopping.html',
  styleUrl: './shopping.css',
})
export class Shopping implements OnInit {

  itensCarrinho: ItemCarrinho[] = [];
  codigoCupom: string = '';
  mensagemCupom: string = '';
  descontoCupom: number = 0;

  // Frete
  cepDigitado: string = '';
  cepAtual: string = '';
  calculandoFrete: boolean = false;
  erroFrete: string = '';
  opcoesFreteDisponiveis: FreteOpcao[] = [];
  opcaoFreteSelecionada: FreteOpcao | null = null;

  private readonly TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiJhZGM4OGU2OWM3NTk5NDlkZWMxMWZmZTM2MzE1Yjg3OGU2ZDkxNWE4MGNlYTkyNGM1NDA0NGE0Y2M4YjcyOTM1MTRjYWYyZTY1NzhmNDI0MCIsImlhdCI6MTc3OTc3MDAxNy4yNjE4ODksIm5iZiI6MTc3OTc3MDAxNy4yNjE4OTMsImV4cCI6MTgxMTMwNjAxNy4yNTA3NDUsInN1YiI6ImExZGU3ZWYwLTZkNDEtNDU3OS05N2Q1LTg1NmRiZjA4Yzg2OSIsInNjb3BlcyI6WyJzaGlwcGluZy1jYWxjdWxhdGUiXX0.SpPf6wHhxhLkdVob-eynqIrLdPP4OzAJV9frdqOpxXBogv7l1BeHsgeUo8vXzIa5Im0RMWUq9a45mc6trfQq6InF770TY2x--z64R3jFXJ1lL6IbCq78YhkmPsImDvoLT0ZNZYf3v18AjPGALMx0W8drkhi1Z5tizb9eU_5WOBQ3eGKIdG6TRKUDVV8Fi6FtgEG9sFEZOm3qKD0QG6ZTNgT9uWZ94z32syze8SrXqs-0BUYl-_ksfUMKGEkvTf2DaQqJq0zlMjDmidKl74DNGPUwHz7U31Dd4XKs6magICicFIAXMO570xj07ouOWRtIWfMTYXVM3qedqvRH2BHJNGsVZPjUu8GfFBfPyvTIXwmQWpy0CMnQVZyLknWVrfj0-CfS0MdR8SciAebyGvXigMa-Qs2ZdDQ1L95bPSgx4j9Ce2PxxQJXkEq9S_9Gjo5hQyuNrW7aa5oNISf69-4K0x1GryxHJeukRZFEU59-DqNGyv0DK3lZSa_ojtq2bVoDTaAFTzshK3iEx81rSe2lw6jofpkkoBbDJZ64hJfrd8Lh7vh30i-_-V3zOgLZBZOhBRF6YMxm7Q6GIyUe0P-XJVUl1MWZHc18KT8MGodBeGi7TA0eMK72oCLllPBB7qDPCDGDVau6Suz_S1gHcPvg8jddfEja5W8ZNMQdo1iLlHI';
  private readonly CEP_ORIGEM = '01402000';
  private readonly ME_URL = '/melhorenvio/api/v2/me/shipment/calculate';

  constructor(
  private router: Router,
  private http: HttpClient,
  @Inject(PLATFORM_ID) private platformId: Object 
) {}

  ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {  // ← só acessa no browser
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      this.itensCarrinho = JSON.parse(carrinhoSalvo);
    }
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
      (acc, item) => acc + item.produto.current_price * item.quantidade, 0
    );
  }

  get total(): number {
    const frete = this.opcaoFreteSelecionada ? parseFloat(this.opcaoFreteSelecionada.preco) : 0;
    return this.subtotal + frete - this.descontoCupom;
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

  onCepInput(): void {
    const nums = this.cepDigitado.replace(/\D/g, '').slice(0, 8);
    this.cepDigitado = nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums;
    this.erroFrete = '';
  }

  calcularFrete(): void {
    const cepLimpo = this.cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      this.erroFrete = 'Digite um CEP válido com 8 dígitos.';
      return;
    }
    this.calculandoFrete = true;
    this.erroFrete = '';
    this.opcoesFreteDisponiveis = [];
    this.opcaoFreteSelecionada = null;

    const totalQtd = this.itensCarrinho.reduce((acc, i) => acc + i.quantidade, 0);

    this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).pipe(
      map((res: any) => {
        if (res.erro) throw new Error('CEP não encontrado.');
        return res;
      }),
      switchMap(() => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'KiDiverte (duduleiteriveiro@gmail.com)'
        });
        const body = {
          from: { postal_code: this.CEP_ORIGEM },
          to:   { postal_code: cepLimpo },
          products: [{
            id: '1', width: 50, height: 50, length: 50,
            weight: 15 * totalQtd, insurance_value: 0, quantity: totalQtd
          }],
          options: { receipt: false, own_hand: false }
        };
        return this.http.post<any[]>(this.ME_URL, body, { headers });
      })
    ).subscribe({
      next: (resultado: any[]) => {
        this.cepAtual = this.cepDigitado;
        this.opcoesFreteDisponiveis = resultado
          .filter((s: any) => !s.error && s.price)
          .map((s: any) => ({
            id: s.id, nome: s.name,
            preco: s.custom_price ?? s.price,
            prazo: s.custom_delivery_time ?? s.delivery_time,
            logo: s.company?.picture ?? ''
          }));
        this.calculandoFrete = false;
        if (this.opcoesFreteDisponiveis.length === 0) {
          this.erroFrete = 'Nenhuma opção de frete disponível para este CEP.';
        }
      },
      error: (err: any) => {
        this.calculandoFrete = false;
        this.erroFrete = err?.message ?? 'Erro ao calcular frete.';
      }
    });
  }

  selecionarFrete(op: FreteOpcao): void {
    this.opcaoFreteSelecionada = op;
  }

  formatarMoeda(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  formatarFretePreco(preco: string): string {
    return parseFloat(preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
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
  if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem('carrinho', JSON.stringify(this.itensCarrinho));
  }
 }
}