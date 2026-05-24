import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
export class AppModule {}