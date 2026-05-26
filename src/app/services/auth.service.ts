import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  gender: string;
  cpf: string;
  phone: string;
  birthDate: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId) : null;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          throw new Error('Credenciais inválidas');
        }
        return user;
      }),
      tap(user => {
        localStorage.setItem('auth_token', `token_${user.id}_${Date.now()}`);
        localStorage.setItem('user_id', user.id.toString());
        localStorage.setItem('user_data', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map(users => {
        const emailExists = users.some(u => u.email === userData.email);
        if (emailExists) {
          throw new Error('Email já cadastrado');
        }

        const newUser: User = {
          id: Math.max(...users.map(u => u.id), 0) + 1,
          name: userData.name || '',
          surname: userData.surname || '',
          email: userData.email || '',
          password: userData.password || '',
          gender: userData.gender || '',
          cpf: userData.cpf || '',
          phone: userData.phone || '',
          birthDate: userData.birthDate || '',
          createdAt: new Date().toISOString()
        };

        return newUser;
      }),
      tap(newUser => {
        this.http.post<User>(this.apiUrl, newUser).subscribe(user => {
          localStorage.setItem('auth_token', `token_${user.id}_${Date.now()}`);
          localStorage.setItem('user_id', user.id.toString());
          localStorage.setItem('user_data', JSON.stringify(user));
          this.currentUserSubject.next(user);
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_data');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
