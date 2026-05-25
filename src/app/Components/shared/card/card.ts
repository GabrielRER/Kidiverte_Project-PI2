import { Component, Input, OnInit } from '@angular/core';
import { StarRate } from '../star-rate/star-rate';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService, Product } from '../../../services/product.service';


@Component({
  selector: 'app-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    StarRate,
    RouterModule
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  @Input({ required: true }) product!: Product;
}
