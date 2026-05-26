import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface FreteOpcao {
  id: number;
  nome: string;
  preco: string;
  prazo: number;
  logo: string;
}

@Component({
  selector: 'app-shipping-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="sc-wrapper">
      <div class="sc-title">🚚 Calcular Frete</div>

      <div class="sc-cep-row">
        <input
          type="text"
          class="sc-cep-input"
          placeholder="00000-000"
          maxlength="9"
          [(ngModel)]="cepDigitado"
          (input)="onCepInput()"
          (keyup.enter)="calcular()"
        />
        <button class="sc-cep-btn" (click)="calcular()" [disabled]="carregando">
          {{ carregando ? '...' : 'Calcular' }}
        </button>
      </div>

      <div class="sc-endereco" *ngIf="endereco">
        📍 {{ endereco.logradouro }}, {{ endereco.bairro }} — {{ endereco.localidade }}/{{ endereco.uf }}
      </div>

      <div class="sc-erro" *ngIf="erro">⚠️ {{ erro }}</div>

      <div class="sc-opcoes" *ngIf="fretes.length > 0">
        <div
          class="sc-opcao"
          *ngFor="let frete of fretes"
          [class.sc-opcao-selecionada]="freteSelecionado?.id === frete.id"
          (click)="selecionarFrete(frete)"
        >
          <div class="sc-opcao-left">
            <img *ngIf="frete.logo" [src]="frete.logo" [alt]="frete.nome" class="sc-logo" />
            <div class="sc-opcao-info">
              <span class="sc-opcao-nome">{{ frete.nome }}</span>
              <span class="sc-opcao-prazo">{{ frete.prazo }} dia{{ frete.prazo > 1 ? 's' : '' }} útil{{ frete.prazo > 1 ? 'eis' : '' }}</span>
            </div>
          </div>
          <span class="sc-opcao-preco">
            {{ frete.preco === '0.00' || frete.preco === '0' ? 'Grátis' : 'R$ ' + formatarPreco(frete.preco) }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sc-wrapper { display: flex; flex-direction: column; gap: 10px; font-family: 'Nunito', sans-serif; }
    .sc-title { font-size: .9rem; font-weight: 800; color: #4B5563; }
    .sc-cep-row { display: flex; gap: 8px; }
    .sc-cep-input {
      flex: 1; padding: 9px 14px; border: 2px solid #E5E7EB;
      border-radius: 10px; font-family: 'Nunito', sans-serif;
      font-size: .9rem; outline: none; transition: border-color .2s;
    }
    .sc-cep-input:focus { border-color: #7C3AED; }
    .sc-cep-btn {
      padding: 9px 16px; background: #7C3AED; color: #fff;
      border: none; border-radius: 10px; font-weight: 800;
      font-size: .85rem; cursor: pointer; font-family: 'Nunito', sans-serif;
      transition: background .2s; white-space: nowrap;
    }
    .sc-cep-btn:hover:not(:disabled) { background: #6D28D9; }
    .sc-cep-btn:disabled { opacity: .6; cursor: not-allowed; }
    .sc-endereco {
      font-size: .78rem; color: #10B981; font-weight: 700;
      background: #ECFDF5; padding: 6px 10px; border-radius: 8px;
    }
    .sc-erro {
      font-size: .8rem; color: #EF4444; font-weight: 700;
      background: #FEF2F2; padding: 6px 10px; border-radius: 8px;
    }
    .sc-opcoes { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
    .sc-opcao {
      display: flex; justify-content: space-between; align-items: center;
      background: #fff; border: 2px solid #E5E7EB; border-radius: 10px;
      padding: 10px 14px; cursor: pointer; transition: border-color .2s, background .2s;
    }
    .sc-opcao:hover { border-color: #7C3AED; background: #F5F3FF; }
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
  @Input() quantidade: number = 1;

  private readonly TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NTYiLCJqdGkiOiJhZGM4OGU2OWM3NTk5NDlkZWMxMWZmZTM2MzE1Yjg3OGU2ZDkxNWE4MGNlYTkyNGM1NDA0NGE0Y2M4YjcyOTM1MTRjYWYyZTY1NzhmNDI0MCIsImlhdCI6MTc3OTc3MDAxNy4yNjE4ODksIm5iZiI6MTc3OTc3MDAxNy4yNjE4OTMsImV4cCI6MTgxMTMwNjAxNy4yNTA3NDUsInN1YiI6ImExZGU3ZWYwLTZkNDEtNDU3OS05N2Q1LTg1NmRiZjA4Yzg2OSIsInNjb3BlcyI6WyJzaGlwcGluZy1jYWxjdWxhdGUiXX0.SpPf6wHhxhLkdVob-eynqIrLdPP4OzAJV9frdqOpxXBogv7l1BeHsgeUo8vXzIa5Im0RMWUq9a45mc6trfQq6InF770TY2x--z64R3jFXJ1lL6IbCq78YhkmPsImDvoLT0ZNZYf3v18AjPGALMx0W8drkhi1Z5tizb9eU_5WOBQ3eGKIdG6TRKUDVV8Fi6FtgEG9sFEZOm3qKD0QG6ZTNgT9uWZ94z32syze8SrXqs-0BUYl-_ksfUMKGEkvTf2DaQqJq0zlMjDmidKl74DNGPUwHz7U31Dd4XKs6magICicFIAXMO570xj07ouOWRtIWfMTYXVM3qedqvRH2BHJNGsVZPjUu8GfFBfPyvTIXwmQWpy0CMnQVZyLknWVrfj0-CfS0MdR8SciAebyGvXigMa-Qs2ZdDQ1L95bPSgx4j9Ce2PxxQJXkEq9S_9Gjo5hQyuNrW7aa5oNISf69-4K0x1GryxHJeukRZFEU59-DqNGyv0DK3lZSa_ojtq2bVoDTaAFTzshK3iEx81rSe2lw6jofpkkoBbDJZ64hJfrd8Lh7vh30i-_-V3zOgLZBZOhBRF6YMxm7Q6GIyUe0P-XJVUl1MWZHc18KT8MGodBeGi7TA0eMK72oCLllPBB7qDPCDGDVau6Suz_S1gHcPvg8jddfEja5W8ZNMQdo1iLlHI';
  private readonly CEP_ORIGEM = '01402000';
  private readonly ME_URL = '/melhorenvio/api/v2/me/shipment/calculate';

  cepDigitado = '';
  carregando = false;
  erro = '';
  endereco: ViaCepResponse | null = null;
  fretes: FreteOpcao[] = [];
  freteSelecionado: FreteOpcao | null = null;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  onCepInput(): void {
    const nums = this.cepDigitado.replace(/\D/g, '').slice(0, 8);
    this.cepDigitado = nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums;
    this.erro = '';
    if (nums.length < 8) {
      this.endereco = null;
      this.fretes = [];
    }
  }

  calcular(): void {
    const cepLimpo = this.cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      this.erro = 'Digite um CEP válido com 8 dígitos.';
      return;
    }
    this.carregando = true;
    this.erro = '';
    this.endereco = null;
    this.fretes = [];
    this.freteSelecionado = null;
    this.cdr.detectChanges();

    this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${cepLimpo}/json/`).pipe(
      map((res: ViaCepResponse) => {
        if (res.erro) throw new Error('CEP não encontrado.');
        return res;
      }),
      switchMap((res: ViaCepResponse) => {
        this.endereco = res;
        this.cdr.detectChanges();

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${this.TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'KiDiverte (duduleiteriveiro@gmail.com)'
        });

        const body = {
          from: { postal_code: this.CEP_ORIGEM },
          to:   { postal_code: cepLimpo },
          products: [
            {
              id: '1',
              width: 50,
              height: 50,
              length: 50,
              weight: 15 * this.quantidade,
              insurance_value: 0,
              quantity: this.quantidade
            }
          ],
          options: { receipt: false, own_hand: false }
        };

        return this.http.post<any[]>(this.ME_URL, body, { headers });
      })
    ).subscribe({
      next: (resultado: any[]) => {
        this.fretes = resultado
          .filter((s: any) => !s.error && s.price)
          .map((s: any) => ({
            id:    s.id,
            nome:  s.name,
            preco: s.custom_price ?? s.price,
            prazo: s.custom_delivery_time ?? s.delivery_time,
            logo:  s.company?.picture ?? ''
          }));
        this.carregando = false;
        if (this.fretes.length === 0) {
          this.erro = 'Nenhuma opção de frete disponível para este CEP.';
        }
        this.cdr.detectChanges(); 
      },
      error: (err: any) => {
        this.carregando = false;
        this.erro = err?.message ?? 'Erro ao calcular frete. Tente novamente.';
        this.cdr.detectChanges();
      }
    });
  }

  selecionarFrete(frete: FreteOpcao): void {
    this.freteSelecionado = frete;
    this.cdr.detectChanges();
  }

  formatarPreco(preco: string): string {
    return parseFloat(preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
}