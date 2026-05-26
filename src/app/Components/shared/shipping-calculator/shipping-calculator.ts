import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { CartService } from '../../../services/cart.service';

// Interface que define o formato da resposta da API ViaCEP
interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string;         // Estado
  erro?: boolean;     // Campo opcional: presente e true quando o CEP não existe
}

// Interface exportada que define o formato de cada opção de frete retornada pela API
// O 'export' permite que outros componentes (ex: CartService) usem este tipo
export interface FreteOpcao {
  id: number;
  nome: string;
  preco: string;
  prazo: number; // Em dias úteis
  logo: string;  // URL do logo da transportadora
}

@Component({
  selector: 'app-shipping-calculator', // Usado no product-detail.html como <app-shipping-calculator>
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],

  // Template e estilos definidos inline (sem arquivos .html/.css separados)
  template: `
    <div class="sc-wrapper">
      <div class="sc-title">🚚 Calcular Frete</div>

      <div class="sc-cep-row">
        <!-- Two-way binding com cepDigitado; formata CEP a cada digitação e permite confirmar com Enter -->
        <input
          type="text"
          class="sc-cep-input"
          placeholder="00000-000"
          maxlength="9"
          [(ngModel)]="cepDigitado"
          (input)="onCepInput()"
          (keyup.enter)="calcular()"
        />
        <!-- Botão desabilitado enquanto a requisição está em andamento (carregando) -->
        <button class="sc-cep-btn" (click)="calcular()" [disabled]="carregando">
          {{ carregando ? '...' : 'Calcular' }}
        </button>
      </div>

      <!-- Endereço encontrado pelo ViaCEP após a busca bem-sucedida -->
      <div class="sc-endereco" *ngIf="endereco">
        📍 {{ endereco.logradouro }}, {{ endereco.bairro }} — {{ endereco.localidade }}/{{ endereco.uf }}
      </div>

      <!-- Mensagem de erro (CEP inválido, frete indisponível, erro de rede, etc.) -->
      <div class="sc-erro" *ngIf="erro">⚠️ {{ erro }}</div>

      <!-- Lista de opções de frete: só renderizada após resultado da API Melhor Envio -->
      <div class="sc-opcoes" *ngIf="fretes.length > 0">

        <!-- [class.sc-opcao-selecionada] destaca visualmente a opção escolhida pelo usuário -->
        <!-- (click) chama selecionarFrete() que salva a escolha no CartService -->
        <div
          class="sc-opcao"
          *ngFor="let frete of fretes"
          [class.sc-opcao-selecionada]="freteSelecionado?.id === frete.id"
          (click)="selecionarFrete(frete)"
        >
          <!-- Lado esquerdo: logo da transportadora + nome + prazo de entrega -->
          <div class="sc-opcao-left">
            <img *ngIf="frete.logo" [src]="frete.logo" [alt]="frete.nome" class="sc-logo" />
            <div class="sc-opcao-info">
              <span class="sc-opcao-nome">{{ frete.nome }}</span>
              <!-- Pluralização dinâmica: "1 dia útil" vs "X dias úteis" -->
              <span class="sc-opcao-prazo">
                {{ frete.prazo }} dia{{ frete.prazo > 1 ? 's' : '' }}
                útil{{ frete.prazo > 1 ? 'eis' : '' }}
              </span>
            </div>
          </div>
          <!-- Lado direito: preço formatado ou "Grátis" quando o valor for zero -->
          <span class="sc-opcao-preco">
            {{ frete.preco === '0.00' || frete.preco === '0' ? 'Grátis' : 'R$ ' + formatarPreco(frete.preco) }}
          </span>
        </div>
      </div>
    </div>
  `,

  // Estilos CSS inline (encapsulados no componente — não vazam para outros elementos)
  styles: [`
    .sc-wrapper { display: flex; flex-direction: column; gap: 10px; font-family: 'Nunito', sans-serif; }
    .sc-title { font-size: .9rem; font-weight: 800; color: #4B5563; }
    .sc-cep-row { display: flex; gap: 8px; }

    /* Input de CEP: borda muda para roxo ao focar */
    .sc-cep-input {
      flex: 1; padding: 9px 14px; border: 2px solid #E5E7EB;
      border-radius: 10px; font-family: 'Nunito', sans-serif;
      font-size: .9rem; outline: none; transition: border-color .2s;
    }
    .sc-cep-input:focus { border-color: #7C3AED; }

    /* Botão roxo de calcular; escurece no hover e fica opaco quando desabilitado */
    .sc-cep-btn {
      padding: 9px 16px; background: #7C3AED; color: #fff;
      border: none; border-radius: 10px; font-weight: 800;
      font-size: .85rem; cursor: pointer; font-family: 'Nunito', sans-serif;
      transition: background .2s; white-space: nowrap;
    }
    .sc-cep-btn:hover:not(:disabled) { background: #6D28D9; }
    .sc-cep-btn:disabled { opacity: .6; cursor: not-allowed; }

    /* Endereço encontrado: fundo verde claro */
    .sc-endereco {
      font-size: .78rem; color: #10B981; font-weight: 700;
      background: #ECFDF5; padding: 6px 10px; border-radius: 8px;
    }

    /* Mensagem de erro: fundo vermelho claro */
    .sc-erro {
      font-size: .8rem; color: #EF4444; font-weight: 700;
      background: #FEF2F2; padding: 6px 10px; border-radius: 8px;
    }

    .sc-opcoes { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }

    /* Card de cada opção de frete; hover e selecionado ficam com borda roxa */
    .sc-opcao {
      display: flex; justify-content: space-between; align-items: center;
      background: #fff; border: 2px solid #E5E7EB; border-radius: 10px;
      padding: 10px 14px; cursor: pointer; transition: border-color .2s, background .2s;
    }
    .sc-opcao:hover { border-color: #7C3AED; background: #F5F3FF; }

    /* Opção selecionada: fundo lilá + borda roxa */
    .sc-opcao-selecionada { border-color: #7C3AED; background: #EDE9FE; }

    .sc-opcao-left { display: flex; align-items: center; gap: 10px; }
    .sc-logo { width: 36px; height: 36px; object-fit: contain; border-radius: 6px; }
    .sc-opcao-info { display: flex; flex-direction: column; }
    .sc-opcao-nome { font-size: .85rem; font-weight: 800; color: #111827; }
    .sc-opcao-prazo { font-size: .75rem; color: #9CA3AF; font-weight: 600; }
    .sc-opcao-preco { font-size: .9rem; font-weight: 800; color: #7C3AED; white-space: nowrap; }
  `]
})
export class ShippingCalculator {

  // Injeção do CartService: usado para obter os produtos do carrinho
  // e para salvar o frete selecionado
  private cartService = inject(CartService);

  // Token de autenticação JWT da API Melhor Envio
  // (gerado no painel do Melhor Envio com escopo shipping-calculate)
  private readonly TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiJhZGM4OGU2OWM3NTk5NDlkZWMxMWZmZTM2MzE1Yjg3OGU2ZDkxNWE4MGNlYTkyNGM1NDA0NGE0Y2M4YjcyOTM1MTRjYWYyZTY1NzhmNDI0MCIsImlhdCI6MTc3OTc3MDAxNy4yNjE4ODksIm5iZiI6MTc3OTc3MDAxNy4yNjE4OTMsImV4cCI6MTgxMTMwNjAxNy4yNTA3NDUsInN1YiI6ImExZGU3ZWYwLTZkNDEtNDU3OS05N2Q1LTg1NmRiZjA4Yzg2OSIsInNjb3BlcyI6WyJzaGlwcGluZy1jYWxjdWxhdGUiXX0.SpPf6wHhxhLkdVob-eynqIrLdPP4OzAJV9frdqOpxXBogv7l1BeHsgeUo8vXzIa5Im0RMWUq9a45mc6trfQq6InF770TY2x--z64R3jFXJ1lL6IbCq78YhkmPsImDvoLT0ZNZYf3v18AjPGALMx0W8drkhi1Z5tizb9eU_5WOBQ3eGKIdG6TRKUDVV8Fi6FtgEG9sFEZOm3qKD0QG6ZTNgT9uWZ94z32syze8SrXqs-0BUYl-_ksfUMKGEkvTf2DaQqJq0zlMjDmidKl74DNGPUwHz7U31Dd4XKs6magICicFIAXMO570xj07ouOWRtIWfMTYXVM3qedqvRH2BHJNGsVZPjUu8GfFBfPyvTIXwmQWpy0CMnQVZyLknWVrfj0-CfS0MdR8SciAebyGvXigMa-Qs2ZdDQ1L95bPSgx4j9Ce2PxxQJXkEq9S_9Gjo5hQyuNrW7aa5oNISf69-4K0x1GryxHJeukRZFEU59-DqNGyv0DK3lZSa_ojtq2bVoDTaAFTzshK3iEx81rSe2lw6jofpkkoBbDJZ64hJfrd8Lh7vh30i-_-V3zOgLZBZOhBRF6YMxm7Q6GIyUe0P-XJVUl1MWZHc18KT8MGodBeGi7TA0eMK72oCLllPBB7qDPCDGDVau6Suz_S1gHcPvg8jddfEja5W8ZNMQdo1iLlHI';

  // CEP de origem da loja (usado como remetente no cálculo do frete)
  private readonly CEP_ORIGEM = '01402000';

  // Endpoint da API Melhor Envio para cálculo de fretes
  // O prefixo /melhorenvio é um proxy configurado no angular.json
  // para evitar problemas de CORS em desenvolvimento
  private readonly ME_URL = '/melhorenvio/api/v2/me/shipment/calculate';

  // Estado do componente
  cepDigitado = '';                           // Valor atual do input de CEP
  carregando = false;                         // True durante as requisições HTTP
  erro = '';                                  // Mensagem de erro exibida ao usuário
  endereco: ViaCepResponse | null = null;     // Endereço retornado pelo ViaCEP
  fretes: FreteOpcao[] = [];                  // Lista de opções de frete disponíveis
  freteSelecionado: FreteOpcao | null = null; // Opção escolhida pelo usuário

  // ChangeDetectorRef: força atualização da view após operações assíncronas
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  // Executado a cada digitação no input de CEP:
  // formata automaticamente para o padrão 00000-000 e limpa o estado anterior
  onCepInput(): void {
    const nums = this.cepDigitado.replace(/\D/g, '').slice(0, 8); // Remove não-dígitos
    // Insere o hífen após o 5º dígito quando há mais de 5 dígitos
    this.cepDigitado = nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums;
    this.erro = '';
    // Limpa endereço e fretes se o CEP ainda estiver incompleto
    if (nums.length < 8) {
      this.endereco = null;
      this.fretes = [];
    }
  }

  // Fluxo principal do cálculo de frete (duas requisições encadeadas com RxJS):
  // 1ª: ViaCEP → valida o CEP e obtém o endereço
  // 2ª: Melhor Envio → calcula as opções de frete com base no CEP validado
  calcular(): void {
    const cepLimpo = this.cepDigitado.replace(/\D/g, ''); // Remove o hífen

    if (cepLimpo.length !== 8) {
      this.erro = 'Digite um CEP válido com 8 dígitos.';
      return;
    }

    // Reseta o estado antes de uma nova busca
    this.carregando = true;
    this.erro = '';
    this.endereco = null;
    this.fretes = [];
    this.freteSelecionado = null;
    this.cdr.detectChanges();

    // PRIMEIRA REQUISIÇÃO: ViaCEP (gratuita, sem autenticação)
    this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cepLimpo}/json/`).pipe(

      // 'map' transforma a resposta: lança erro se o campo 'erro' estiver presente
      map((res: ViaCepResponse) => {
        if (res.erro) throw new Error('CEP não encontrado.');
        return res;
      }),

      // 'switchMap' cancela a requisição anterior e inicia a próxima:
      // recebe o endereço validado e dispara a chamada ao Melhor Envio
      switchMap((res: ViaCepResponse) => {
        this.endereco = res; // Salva o endereço para exibir no template
        this.cdr.detectChanges();

        // Headers obrigatórios pela API Melhor Envio (JWT Bearer + User-Agent)
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'KiDiverte (duduleiteriveiro@gmail.com)'
        });

        // Corpo da requisição: CEP origem/destino + produtos do carrinho
        const body = {
          from: { postal_code: this.CEP_ORIGEM },
          to:   { postal_code: cepLimpo },
          // obterProdutosParaFrete() retorna peso/dimensões dos itens do carrinho
          products: this.cartService.obterProdutosParaFrete(),
          options: { receipt: false, own_hand: false } // Sem aviso de recebimento nem mão própria
        };

        // SEGUNDA REQUISIÇÃO: Melhor Envio
        return this.http.post<any[]>(this.ME_URL, body, { headers });
      })

    ).subscribe({
      // Processa a lista de transportadoras retornada pelo Melhor Envio
      next: (resultado: any[]) => {
        this.fretes = resultado
          .filter((s: any) => !s.error && s.price) // Remove opções com erro ou sem preço
          .map((s: any) => ({
            id:    s.id,
            nome:  s.name,
            preco: s.custom_price ?? s.price,               // Prefere preço customizado se houver
            prazo: s.custom_delivery_time ?? s.delivery_time, // Idem para prazo
            logo:  s.company?.picture ?? ''                 // Logo da transportadora
          }));
        this.carregando = false;
        if (this.fretes.length === 0) {
          this.erro = 'Nenhuma opção de frete disponível para este CEP.';
        }
        this.cdr.detectChanges();
      },
      // Trata erros de rede, CEP inválido ou falha da API
      error: (err: any) => {
        this.carregando = false;
        this.erro = err?.message ?? 'Erro ao calcular frete. Tente novamente.';
        this.cdr.detectChanges();
      }
    });
  }

  // Registra a opção de frete escolhida localmente e no CartService,
  // para que o valor do frete apareça no resumo do pedido
  selecionarFrete(frete: FreteOpcao): void {
    this.freteSelecionado = frete;
    this.cartService.freteSelecionado = frete; // Compartilha com o restante da aplicação
    this.cdr.detectChanges();
  }

  // Converte a string de preço da API ("19.90") para o formato brasileiro ("19,90")
  formatarPreco(preco: string): string {
    return parseFloat(preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
}