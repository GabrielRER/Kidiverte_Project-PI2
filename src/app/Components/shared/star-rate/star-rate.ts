import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-star-rate',
  imports: [MatIconModule],
  templateUrl: './star-rate.html',
  styleUrl: './star-rate.css',
})
export class StarRate implements OnInit {
  stars: number[] = [1, 2, 3, 4, 5];
  
  @Input() productId: number = 0;
  @Input() rating: number = 0;
  
  @Output() ratingChange = new EventEmitter<number>();

  hoverRating: number = 0;
  userId: number | null = null;

  constructor(
    private authService: AuthService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    
    if (this.userId && this.productId) {
      this.rating = this.ratingService.getUserProductRating(this.userId, this.productId);
    }
  }

  setRating(ratingValue: number): void {
    if (!this.userId) {
      alert('Você precisa estar logado para avaliar produtos');
      return;
    }

    this.rating = ratingValue;
    this.ratingChange.emit(this.rating);

    this.ratingService.saveRating(this.userId, this.productId, ratingValue).subscribe({
      next: () => {
        console.log('Rating salvo com sucesso');
      },
      error: (err) => {
        console.error('Erro ao salvar rating', err);
      }
    });
  }

  setHover(ratingValue: number): void {
    this.hoverRating = ratingValue;
  }

  resetHover(): void {
    this.hoverRating = 0;
  }
}