import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Card } from './Components/shared/card/card';
import { ProductDetail } from './Components/product-detail/product-detail';
import { routes } from './app.routes';
import { Shopping } from './Components/shopping/shopping';
import { provideHttpClient } from '@angular/common/http';
import { ShippingCalculator } from './Components/shared/shipping-calculator/shipping-calculator';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ProductDetail,
    Shopping,
  ],
  imports: [
    CommonModule,
    FormsModule,
    Card,
    ShippingCalculator,
    HttpClientModule,
  ],

  providers: [
    provideHttpClient()
  ]
})

export class AppModule {}