// avis.service.ts (Angular)
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Avis {
  id?: string;
  note: number;
  commentaire: string;
  date?: Date;
  client?: any;
  user?: string; // Pour l'affichage dans l'interface
  statut: 'pending' | 'approved' | 'rejected';
}

export interface UpdateAvisPayload {
  note?: number;
  commentaire?: string;
  statut?: 'pending' | 'approved' | 'rejected';
  clientId?: string;
}

export interface ApiResponse {
  data: Avis[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AvisService {
  private baseUrl = 'http://localhost:3002/api/v1/avis';

  constructor(private http: HttpClient) { }

  // Gestionnaire d'erreur générique
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}, Message: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllAvis(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getAvisById(id: string): Observable<Avis> {
    return this.http.get<Avis>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createAvis(avis: any): Observable<Avis> {
    return this.http.post<Avis>(this.baseUrl, avis)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateAvis(id: string, payload: UpdateAvisPayload): Observable<Avis> {
    if (!id) {
      return throwError(() => new Error('ID de l\'avis est requis'));
    }
    
    return this.http.put<Avis>(`${this.baseUrl}/${id}`, payload)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteAvis(id: string): Observable<void> {
    if (!id) {
      return throwError(() => new Error('ID de l\'avis est requis'));
    }
    
    return this.http.delete<void>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
}