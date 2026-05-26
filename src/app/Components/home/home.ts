import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { Card } from '../shared/card/card';


@Component({
  selector: 'app-home',
  imports: [Card],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  productsNewToys: Product[] = [];
  productsBestSellers: Product[] = [];

  @ViewChild('carrosselNewToys') carrosselNewToys!: ElementRef<HTMLDivElement>;
  @ViewChild('carrosselBestSellers') carrosselBestSellers!: ElementRef<HTMLDivElement>;

  scrollCarrosselNewToys(direction: number){
    const widthCard = this.carrosselNewToys.nativeElement.clientWidth;
    this.carrosselNewToys.nativeElement.scrollBy({
      left: direction * widthCard,
      behavior: 'smooth'
    });
  }

  scrollCarrosselBestSellers(direction: number){
    const widthCard = this.carrosselBestSellers.nativeElement.clientWidth;
    this.carrosselBestSellers.nativeElement.scrollBy({
      left: direction * widthCard,
      behavior: 'smooth'
    });
  }

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productsNewToys = data.filter(p => p.created_at.startsWith('2026-05'));
        
        this.productsBestSellers = data.filter(p => p.best_seller === true);
      },
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  filtrarCategoria(idCategoria: number): void {
    this.router.navigate(['/plp'], { queryParams: { categoria: idCategoria } });
  }

  
  filtrarMarca(nomeMarca: string): void {
    this.router.navigate(['/plp'], { queryParams: { marca: nomeMarca } });
  }

}