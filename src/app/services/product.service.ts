import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface Product {
  id: number;
  name: string;
  description: string;
  current_price: number;
  images: string;
}