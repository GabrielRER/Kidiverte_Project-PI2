import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from './Components/footer/footer';
import { ProductDetail } from './Components/product-detail/product-detail';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    ProductDetail
  ],
  imports: [
    CommonModule,
    FormsModule,
    Footer,
    RouterModule.forRoot(routes),
    HttpClientModule
  ]
})
export class AppModule {}