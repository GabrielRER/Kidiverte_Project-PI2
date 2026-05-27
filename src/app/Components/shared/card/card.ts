import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { StarRate } from '../star-rate/star-rate';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService, Product } from '../../../services/product.service';
import { RatingService } from '../../../services/rating.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    StarRate,
    RouterModule,
    CommonModule
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card implements OnInit {
  @Input({ required: true }) product!: Product;
  
  averageRating: number = 0;
  ratingCount: number = 0;

  constructor(
    private ratingService: RatingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateRatingInfo();

    this.ratingService.ratings$.subscribe(() => {
      this.updateRatingInfo();
    });
  }

  private updateRatingInfo(): void {
    this.averageRating = this.ratingService.getProductAverageRating(this.product.id);
    this.ratingCount = this.ratingService.getProductRatingCount(this.product.id);
    this.cdr.detectChanges();
  }
}

