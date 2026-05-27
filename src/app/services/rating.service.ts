import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Rating {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = 'http://localhost:3000/ratings';
  private ratingsSubject = new BehaviorSubject<Rating[]>([]);
  public ratings$ = this.ratingsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadRatings();
  }

  private loadRatings(): void {
    this.http.get<Rating[]>(this.apiUrl).subscribe(ratings => {
      this.ratingsSubject.next(ratings);
    });
  }

  getRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(this.apiUrl);
  }

  getUserRatingForProduct(userId: number, productId: number): Rating | undefined {
    return this.ratingsSubject.value.find(
      r => r.userId === userId && r.productId === productId
    );
  }

  getProductAverageRating(productId: number): number {
    const productRatings = this.ratingsSubject.value.filter(r => r.productId === productId);
    if (productRatings.length === 0) return 0;
    
    const sum = productRatings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / productRatings.length) * 10) / 10;
  }

  getProductRatingCount(productId: number): number {
    return this.ratingsSubject.value.filter(r => r.productId === productId).length;
  }

  addOrUpdateRating(userId: number, productId: number, rating: number): Observable<Rating> {
    const existingRating = this.ratingsSubject.value.find(
      r => r.userId === userId && r.productId === productId
    );

    if (existingRating) {
      return this.updateRating(existingRating.id, rating);
    } else {
      const newRating: Rating = {
        id: Date.now(),
        userId,
        productId,
        rating,
        createdAt: new Date().toISOString()
      };
      return this.http.post<Rating>(this.apiUrl, newRating).pipe(
        tap(addedRating => {
          this.ratingsSubject.next([...this.ratingsSubject.value, addedRating]);
        })
      );
    }
  }

  private updateRating(ratingId: number, rating: number): Observable<Rating> {
    const url = `${this.apiUrl}/${ratingId}`;
    return this.http.patch<Rating>(url, { rating }).pipe(
      tap(updatedRating => {
        const updatedRatings = this.ratingsSubject.value.map(r =>
          r.id === ratingId ? updatedRating : r
        );
        this.ratingsSubject.next(updatedRatings);
      })
    );
  }

  deleteRating(ratingId: number): Observable<void> {
    const url = `${this.apiUrl}/${ratingId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.ratingsSubject.next(
          this.ratingsSubject.value.filter(r => r.id !== ratingId)
        );
      })
    );
  }
}
