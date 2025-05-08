import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError, tap } from 'rxjs/operators';

export interface RegisterClientModel {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  adresse: string;
  telephone: number;
  photoProfil?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiBaseUrl}/clients`;

  constructor(private http: HttpClient) {}

  // Méthode pour inscrire un nouveau client
  register(client: RegisterClientModel): Observable<any> {
    return this.http.post<any>(this.apiUrl, client);
  }

  // Récupérer tous les clients
  getClients(): Observable<RegisterClientModel[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        if (response && response.data) {
          return response.data as RegisterClientModel[];
        }
        return response as RegisterClientModel[];
      }),
      catchError(error => {
        console.error('Error fetching clients:', error);
        return of([]);
      })
    );
  }

  // Récupérer un client par son ID

  // Obtenir les détails d'un client par ID
  getClientById(id: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.get(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(response => console.log('Client fetched successfully', response)),
      catchError(error => {
        console.error('Error fetching client:', error);
        throw error;
      })
    );
  }

  // Mettre à jour le profil du client
  updateClientProfile(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Ne pas définir Content-Type car il sera automatiquement défini avec FormData
    return this.http.patch(`${this.apiUrl}/${id}`, formData, { headers }).pipe(
      tap(response => console.log('Client updated successfully', response)),
      catchError(error => {
        console.error('Error updating client:', error);
        throw error;
      })
    );
  }

  // Méthode pour formater correctement les URLs des images
  formatImageUrl(imageUrl: string | null | undefined): string {
    if (!imageUrl) {
      return '';
    }
    
    // If it's already a base64 data URI or absolute URL, return as is
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Otherwise, prepend the API base URL
    const baseUrl = environment.apiBaseUrl || 'http://localhost:3000';
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    return `${baseUrl}/${cleanPath}`;
  }



  // Méthode pour convertir une image en base64
  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  // Méthode standard pour mettre à jour un client (sans fichiers)
  updateClient(userId: string, clientData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}`, clientData).pipe(
      catchError(error => {
        console.error('Error updating client:', error);
        return of({ success: false, error: 'Failed to update client data' });
      })
    );
  }

  // Supprimer un client
  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting client with ID ${id}:`, error);
        return of(undefined);
      })
    );
  }
}