import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common'; 

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private isBrowser: boolean;
  
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object 
  ) {
    this.isBrowser = isPlatformBrowser(platformId); 
  }

  private getUserFromStorage(): User | null {
   
    if (this.isBrowser) {
      const user = localStorage.getItem('currentUser');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  register(name: string, email: string, password: string): Observable<User> {
    const newUser: User = {
      id: Date.now(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    return this.http.post<User>(this.apiUrl, newUser).pipe(
      tap(user => {
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Erro no registro:', error);
        return throwError(() => new Error('Erro ao registrar usuário'));
      })
    );
  }

  login(email: string, password: string): Observable<User> {
  // Busca todos os usuários
  return this.http.get<User[]>(this.apiUrl).pipe(
    map(users => {
      // Procura o usuário que bate com email E senha
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }
      return user;
    }),
    tap(user => {
      if (this.isBrowser) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      this.currentUserSubject.next(user);
    })
  );
}

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
}