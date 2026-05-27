import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'; 
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../../services/auth.service';
import { RatingService } from '../../../services/rating.service';

@Component({
  selector: 'app-star-rate',
  imports: [MatIconModule],
  templateUrl: './star-rate.html',
  styleUrl: './star-rate.css',
})
export class StarRate implements OnInit {
  stars: number[] = [1, 2, 3, 4, 5];
  
  @Input() productId: number | null = null;
  @Input() rating: number = 0;
  @Input() averageRating: number = 0;
  @Input() showAverage: boolean = false;
  
  @Output() ratingChange = new EventEmitter<number>(); 

  hoverRating: number = 0;
  currentUser: User | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  setRating(rating: number): void {
    if (!this.currentUser) {
      alert('Você precisa estar logado para avaliar um produto!');
      return;
    }

    if (!this.productId) {
      console.error('Product ID não definido');
      return;
    }

    this.isLoading = true;
    this.ratingService.addOrUpdateRating(this.currentUser.id, this.productId, rating).subscribe({
      next: () => {
        this.rating = rating;
        this.ratingChange.emit(this.rating);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao salvar rating:', err);
        this.isLoading = false;
      }
    });
  }

  setHover(rating: number): void {
    if (!this.isLoading) {
      this.hoverRating = rating;
    }
  }

  resetHover(): void {
    this.hoverRating = 0;
  }
}
