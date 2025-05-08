import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface CreateVehiculeRequest {
  marque: string;
  modele: string;
  immatriculation: string;
  couleur: string;
  annee: number;
  proprietaireId: string;
}

export interface Vehicule {
  id: string;
  marque: string;
  modele: string;
  immatriculation: string;
  couleur: string;
  annee: number;
  proprietaireId: string;
}

@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  private apiUrl = `${environment.apiBaseUrl}/vehicules`;

  constructor(private http: HttpClient) {}

  createVehicule(vehicule: CreateVehiculeRequest): Observable<Vehicule> {
    return this.http.post<Vehicule>(`${this.apiUrl}`, vehicule);
  }

  getVehicules(): Observable<Vehicule[]> {
    return this.http.get<Vehicule[]>(`${this.apiUrl}`);
  }

  getVehiculeById(id: string): Observable<Vehicule> {
    return this.http.get<Vehicule>(`${this.apiUrl}/${id}`);
  }

  updateVehicule(id: string, vehicule: Partial<CreateVehiculeRequest>): Observable<Vehicule> {
    return this.http.put<Vehicule>(`${this.apiUrl}/${id}`, vehicule);
  }

  deleteVehicule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getVehiculesByUserId(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
  }
}
