import { Component, OnInit } from '@angular/core';
import { StarRate } from '../star-rate/star-rate';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ProductService, Product } from '../../../services/product.service';


@Component({
  selector: 'app-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    StarRate
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  imageUrl = '/Images/minecraft_lego_image.png';

}
