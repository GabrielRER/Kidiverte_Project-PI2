import { Component, Input, Output, EventEmitter } from '@angular/core'; 
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-star-rate',
  imports: [MatIconModule],
  templateUrl: './star-rate.html',
  styleUrl: './star-rate.css',
})
export class StarRate {
  stars: number[] = [1, 2, 3, 4, 5];
  
  @Input() rating: number = 0;
  
  @Output() ratingChange = new EventEmitter<number>(); 

  hoverRating: number = 0;

  setRating(rating: number): void {
    this.rating = rating;
    this.ratingChange.emit(this.rating); 
  }

  setHover(rating: number): void {
    this.hoverRating = rating;
  }

  resetHover(): void {
    this.hoverRating = 0;
  }
}