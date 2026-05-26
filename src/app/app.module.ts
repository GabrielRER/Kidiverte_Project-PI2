import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Card } from './Components/shared/card/card';
import { ProductDetail } from './Components/product-detail/product-detail';
import { Shopping } from './Components/shopping/shopping';
import { ShippingCalculator } from './Components/shared/shipping-calculator/shipping-calculator';
import { Footer } from './Components/shared/footer/footer';
import { routes } from './app.routes';
import { StarRate } from './Components/shared/star-rate/star-rate';
import { Payment } from './Components/payment/payment';

@NgModule({
  declarations: [
    ProductDetail,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    Footer,
    Card,
    ShippingCalculator,
    Shopping,
    StarRate,
    Payment,
  ],
  providers: []
})
export class AppModule {}