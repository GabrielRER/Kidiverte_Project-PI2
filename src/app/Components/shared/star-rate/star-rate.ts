import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-star-rate',
  imports: [MatIconModule],
  templateUrl: './star-rate.html',
  styleUrl: './star-rate.css',
})
export class StarRate {

  stars: number[] = [1, 2, 3, 4, 5];
  currentRating: number = 0;
  hoverRating: number = 0;

  setRating(rating: number): void {
    this.currentRating = rating;
  }

  setHover(rating: number): void {
    console.log('Hovering over star: ', rating);
    this.hoverRating = rating;
  }

  resetHover(): void {
    this.hoverRating = 0;
  }
}
