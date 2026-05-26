import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface Rating {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
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

  getProductRating(productId: number): number {
    const ratings = this.ratingsSubject.value.filter(r => r.productId === productId);
    if (ratings.length === 0) return 0;
    const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    return Math.round(average * 10) / 10;
  }

  getUserProductRating(userId: number, productId: number): number {
    const rating = this.ratingsSubject.value.find(
      r => r.userId === userId && r.productId === productId
    );
    return rating ? rating.rating : 0;
  }

  saveRating(userId: number, productId: number, ratingValue: number, comment: string = ''): Observable<Rating> {
    const existingRating = this.ratingsSubject.value.find(
      r => r.userId === userId && r.productId === productId
    );

    const ratingData: Partial<Rating> = {
      userId,
      productId,
      rating: ratingValue,
      comment,
      createdAt: new Date().toISOString()
    };

    if (existingRating) {
      return this.http.put<Rating>(`${this.apiUrl}/${existingRating.id}`, ratingData).pipe(
        tap(updatedRating => {
          const ratings = this.ratingsSubject.value.map(r => 
            r.id === updatedRating.id ? updatedRating : r
          );
          this.ratingsSubject.next(ratings);
        })
      );
    } else {
      return this.http.post<Rating>(this.apiUrl, {
        id: Math.max(...this.ratingsSubject.value.map(r => r.id), 0) + 1,
        ...ratingData
      }).pipe(
        tap(newRating => {
          this.ratingsSubject.next([...this.ratingsSubject.value, newRating]);
        })
      );
    }
  }
}
