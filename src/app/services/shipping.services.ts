import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environments';

export interface ShippingQuoteRequest {
  from: { postal_code: string };
  to: { postal_code: string };
  package: { height: number; width: number; length: number; weight: number };
}

export interface ShippingOption {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  delivery_range: { min: number; max: number };
  company: { id: number; name: string; picture: string };
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ShippingService {
  private readonly apiUrl = 'https://www.melhorenvio.com.br/api/v2/me/shipment/calculate';

  constructor(private http: HttpClient) {}

  calculateShipping(request: ShippingQuoteRequest): Observable<ShippingOption[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${environment.melhorEnvioToken}`,
      'User-Agent': 'KidiVerte App (contato@seusite.com.br)', // obrigatório pela API
    });

    return this.http.post<ShippingOption[]>(this.apiUrl, request, { headers }).pipe(
      map((options) => options.filter((opt) => !opt.error)), // remove transportadoras com erro
      catchError((err) => {
        console.error('Erro ao calcular frete:', err);
        return throwError(() => new Error('Não foi possível calcular o frete.'));
      })
    );
  }

  buildPayload(toPostalCode: string): ShippingQuoteRequest {
    return {
      from: { postal_code: '01311100' }, // CEP da sua loja
      to: { postal_code: toPostalCode.replace(/\D/g, '') },
      package: { height: 4, width: 12, length: 17, weight: 0.3 },
    };
  }
}