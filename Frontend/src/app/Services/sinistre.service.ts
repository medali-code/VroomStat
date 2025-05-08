import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

// Alignement avec les valeurs exactes attendues par le backend
export enum SinistreStatut {
  EN_ATTENTE = 'en attente',
  VALIDE = 'validé',
  REFUSE = 'refusé',
  CLOTURE = 'clôturé'
}

// Définir le type comme une union littérale des chaînes acceptées
export type PieceType =
  'Custode Avant droite' |
  'Custode Avant gauche' |
  'Déflecteur Arrière droite' |
  'Déflecteur Arrière gauche' |
  'Lunette Arrière droite' |
  'Lunette Arrière gauche' |
  'Lunette Arrière' |
  'Pare-brise' |
  'Vitre Arrière droite' |
  'Vitre Arrière gauche' |
  'Vitre Avant droite' |
  'Vitre Avant gauche' |
  'Vitre Latérale droite' |
  'Vitre Latérale gauche';

export interface Sinistre {
  id?: string;
  dateDeclaration: string;
  lieu: string;
  commentaire: string;
  type: PieceType;   // Type union littéral (primary type)
  statut: SinistreStatut;
  clientId: string;
  vehiculeId: string;
  images?: string[]; // Array of filenames
  matriculeAdvr?: string;
  marqueVoitureAdvr?: string;
  agenceAdvr?: string;
  nomAdversaire?: string;
  agenceClient?: string;
  numeroAssurence?: string;
  numeroAssurenceAdversaire?: string;
  prenomAdversaire?: string;
}

export interface SinistreApiResponse {
  data: Sinistre[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SinistreService {
  // Base URL for the Sinistre controller (matches @Controller('sinistres') in backend)
  private apiUrl = 'http://localhost:3002/api/v1/sinistres';

  constructor(private http: HttpClient) {}

  createSinistre(sinistre: Omit<Sinistre, 'id' | 'images' | 'statut'>): Observable<Sinistre> {
    // Note: 'images' and 'statut' are set by the backend on creation
    return this.http.post<Sinistre>(this.apiUrl, sinistre);
  }

  getSinistres(): Observable<SinistreApiResponse> {
    return this.http.get<SinistreApiResponse>(this.apiUrl);
  }

  getSinistreById(id: string): Observable<Sinistre> {
    return this.http.get<Sinistre>(`${this.apiUrl}/${id}`);
  }

  updateSinistre(id: string, sinistre: Partial<Sinistre>): Observable<Sinistre> {
    return this.http.put<Sinistre>(`${this.apiUrl}/${id}`, sinistre);
  }

  deleteSinistre(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  accepterSinistre(id: string): Observable<Sinistre> {
    return this.http.put<Sinistre>(`${this.apiUrl}/approuver/${id}`, {});
  }

  // Méthode uploadImage correcte
  uploadImage(sinistreId: string, file: File): Observable<any> {
    if (!sinistreId) {
      console.error('SinistreId is undefined or empty');
      return throwError(() => new Error('SinistreId is required'));
    }

    const formData = new FormData();
    formData.append('file', file); // 'file' must match the @UploadedFile('file') decorator name in the controller

    return this.http.post<any>(`${this.apiUrl}/upload/${sinistreId}`, formData);
  }

  // Méthode uploadMultipleImages correcte
  uploadMultipleImages(sinistreId: string, files: File[]): Observable<any> {
    if (!sinistreId) {
      console.error('SinistreId is undefined or empty');
      return throwError(() => new Error('SinistreId is required'));
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append('files', file); // 'files' must match the @UploadedFiles('files') decorator name
    });

    return this.http.post<any>(`${this.apiUrl}/upload-multiple/${sinistreId}`, formData);
  }

 
  getImageUrl(filename: string): string {
    if (!filename) return '';
    
    // Properly formed URL that matches backend route
    return `${this.apiUrl}/uploads/sinistres/${filename}`;
  }
}