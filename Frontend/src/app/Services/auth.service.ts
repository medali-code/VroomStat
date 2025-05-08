import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

// Interface pour la structure de réponse API
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Interface pour les données dans la propriété data
export interface TokenData {
  access_token: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  // autres propriétés de l'utilisateur
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl1 = `${environment.apiBaseUrl}`;
  private apiUrl = `${environment.apiBaseUrl}/auth`;

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  
  constructor(private http: HttpClient) {
    // Vérifier si un token existe au démarrage

  }

  private checkInitialAuth(): void {
    // First check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Optionnel : charger le profil de l'utilisateur
        this.getUserProfile().subscribe();
      }
    }
  }
  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<ApiResponse<TokenData>>(`${this.apiUrl1}/api/v1/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Réponse de login reçue:', response);
          if (response && response.data && response.data.access_token) {
            const token = response.data.access_token;
            console.log('Token JWT reçu :', token);
            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', token);
              // Charger le profil utilisateur après connexion
              this.getUserProfile().subscribe();
            }
          } else {
            console.error('Pas de token dans la réponse!', response);
          }
        }),
        map(response => response.data) // Retourne seulement les données
      );
  }
  
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
    this.currentUserSubject.next(null);
  }
  
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token');
    }
    return null;
  }
  
  get isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  resetPassword(email: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.post<ApiResponse<{ message: string }>>(`${this.apiUrl}/reset-password`, { email });
  }
  
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponse<UserProfile>>(`${this.apiUrl}/profile`)
      .pipe(
        map(response => response.data), // Extrait les données de la réponse
        tap(user => this.currentUserSubject.next(user))
      );
  }
  
  get currentUser(): Observable<UserProfile | null> {
    return this.currentUserSubject.asObservable();
  }
  
  get currentUserValue(): UserProfile | null {
    return this.currentUserSubject.value;
  }
}