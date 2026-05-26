import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class Payment implements OnInit {
  private router = inject(Router);

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

  paymentMethod: string = 'credit_card'; 
  couponCode: string = '';
  discountAmount: number = 0;
  

  subtotal: number = 269.90;
  shippingFee: number = 0.00;

  ngOnInit(): void {

  }

  get total(): number {
    return this.subtotal + this.shippingFee - this.discountAmount;
  }

  applyCoupon(): void {
    if (this.couponCode.trim().toUpperCase() === 'DESCONTO10') {
      this.discountAmount = this.subtotal * 0.10;
      alert('Cupom de 10% aplicado com sucesso!');
    } else if (this.couponCode.trim() !== '') {
      alert('Cupom inválido ou expirado.');
    }
  }

  selectPayment(method: string): void {
    this.paymentMethod = method;
  }

  finishPurchase(): void {
    alert(`Compra realizada com sucesso via ${this.paymentMethod.toUpperCase()}!`);
    this.router.navigate(['/home']);
  }

  formatPrice(value: number): string {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}