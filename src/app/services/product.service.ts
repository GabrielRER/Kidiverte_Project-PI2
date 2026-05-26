import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;

  original_price: number | null;
  current_price: number;

  discount_percentage: number | null;

  installments: number | null;
  installment_value: number | null;
  interest_free: boolean;

  category_id: number;
  brand_id: number;
  gender_id: number;
  age_range_id: number;

  featured: boolean;
  best_seller: boolean;

  thumbnail_url: string | null;
  images: string[];

  stock: number;

  created_at: string;

  weight: number;
  width: number;
  height: number;
  length: number;
  
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
}