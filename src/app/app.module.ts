import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Footer } from './Components/shared/footer/footer';
import { ProductDetail } from './Components/product-detail/product-detail';
import { routes } from './app.routes';
import { Shopping } from './Components/shopping/shopping';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    ProductDetail,
    Shopping,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],

  providers: [
    provideHttpClient()
  ]
})

=======
import { HttpClientModule } from '@angular/common/http';
import { Footer } from './Components/footer/footer';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  imports: [
    FormsModule,
    Footer,
    RouterModule.forRoot(routes),
    HttpClientModule
  ]
})
>>>>>>> cartsidebar
export class AppModule {}