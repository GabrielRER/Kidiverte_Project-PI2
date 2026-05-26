// Importações necessárias do Angular
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Usado para navegação entre rotas
import { FormsModule } from '@angular/forms'; // Necessário para usar [(ngModel)] no template

// Decorador que define este arquivo como um componente Angular standalone
@Component({
  selector: 'app-payment',       // Tag HTML usada para renderizar este componente
  standalone: true,              // Componente independente, sem precisar de NgModule
  imports: [FormsModule],        // Importa FormsModule para two-way binding com ngModel
  templateUrl: './payment.html', // Arquivo HTML associado
  styleUrl: './payment.css'      // Arquivo de estilos associado
})
export class Payment implements OnInit {

  // Injeção de dependência do Router para redirecionar o usuário após a compra
  private router = inject(Router);

  // Objeto com os dados do endereço de entrega (simulado/mockado por enquanto)
  shippingAddress = {
    recipient: 'Senhor Fulano',
    street: 'Rua dos Bobos',
    number: '0',
    neighborhood: 'Tocanópolis',
    city: 'Fortaleza',
    state: 'CE',
    cep: '00000-000',
    country: 'Brasil'
  };

  // Método de pagamento selecionado; começa com cartão de crédito como padrão
  paymentMethod: string = 'credit_card';

  // Variáveis relacionadas ao cupom de desconto
  couponCode: string = '';       // Armazena o código digitado pelo usuário
  discountAmount: number = 0;    // Valor do desconto aplicado (em reais)

  // Valores financeiros do pedido (simulados)
  subtotal: number = 269.90;
  shippingFee: number = 0.00;   // Frete grátis neste exemplo

  // Ciclo de vida Angular: executado ao inicializar o componente
  // Reservado para lógica futura (ex: buscar dados reais da API)
  ngOnInit(): void {}

  // Getter que calcula o total automaticamente sempre que subtotal,
  // frete ou desconto forem alterados
  get total(): number {
    return this.subtotal + this.shippingFee - this.discountAmount;
  }

  // Valida e aplica o cupom digitado pelo usuário
  // Aceita o código 'DESCONTO10' que dá 10% de desconto sobre o subtotal
  applyCoupon(): void {
    if (this.couponCode.trim().toUpperCase() === 'DESCONTO10') {
      this.discountAmount = this.subtotal * 0.10;
      alert('Cupom de 10% aplicado com sucesso!');
    } else if (this.couponCode.trim() !== '') {
      alert('Cupom inválido ou expirado.');
    }
  }

  // Atualiza o método de pagamento selecionado quando o usuário clica em um radio button
  selectPayment(method: string): void {
    this.paymentMethod = method;
  }

  // Finaliza a compra: exibe confirmação e redireciona o usuário para a home
  finishPurchase(): void {
    alert(`Compra realizada com sucesso via ${this.paymentMethod.toUpperCase()}!`);
    this.router.navigate(['/home']);
  }

  // Formata um número para o padrão de moeda brasileiro (R$ 00,00)
  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}