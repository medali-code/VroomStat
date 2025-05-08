// suivi-sinistre.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavClientComponent } from "../../Commun/nav-client/nav-client.component";
import { SinistreService, Sinistre, SinistreStatut } from '../../Services/sinistre.service';

@Component({
  selector: 'app-suivi-sinistre',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatExpansionModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    NavClientComponent
  ],
  templateUrl: './suivi-sinistre.component.html',
  styleUrls: ['./suivi-sinistre.component.css']
})
export class SuiviSinistreComponent implements OnInit {
  sinistresForm!: FormGroup;
  loading: boolean = true;
  readonly staticImageUrl: string = '../../../assets/Sinistre.jpg';
 
  // Pour stocker les données complètes des sinistres
  sinistresData: Sinistre[] = [];
 
  // Section statique
  readonly staticCaption: string = 'Assurez-vous d\'être bien informé de l\'état de vos sinistres';
 
  constructor(private sinistreService: SinistreService, private fb: FormBuilder) {
    this.initForm();
  }
 
  ngOnInit(): void {
    this.loadSinistreStatus();
  }

  /**
   * Initialise le formulaire avec un FormArray vide
   */
  private initForm(): void {
    this.sinistresForm = this.fb.group({
      sinistres: this.fb.array([])
    });
  }
 
  /**
   * Retourne le FormArray contenant la liste des sinistres.
   */
  get sinistres(): FormArray {
    return this.sinistresForm.get('sinistres') as FormArray;
  }
 
  /**
   * Récupère la liste des sinistres et met à jour le FormArray.
   */
  loadSinistreStatus(): void {
    this.loading = true;
    this.sinistreService.getSinistres().subscribe({
      next: (response: any) => {
        // Vider le FormArray existant
        this.sinistres.clear();
       
        // Handle different response formats
        let sinistreArray: Sinistre[] = [];
       
        // Check if response is an array
        if (Array.isArray(response)) {
          sinistreArray = response;
        }
        // Check if response has a data property that is an array
        else if (response && response.data && Array.isArray(response.data)) {
          sinistreArray = response.data;
        }
        // Check if response is a single object that should be treated as one sinistre
        else if (response && typeof response === 'object' && response.id) {
          sinistreArray = [response];
        }
        // If still empty, log the response for debugging
        else {
          console.log('Unexpected API response format:', response);
          sinistreArray = [];
        }
       
        // Sauvegarder les données complètes
        this.sinistresData = sinistreArray;
       
        // Process the sinistre array
        sinistreArray.forEach((s: Sinistre) => {
          this.sinistres.push(this.fb.group({
            id: new FormControl({ value: s.id, disabled: true }),
            statut: new FormControl({ value: s.statut, disabled: true }),
            commentaire: new FormControl({ value: s.commentaire || 'Aucun commentaire', disabled: true }),
            dateDeclaration: new FormControl({ value: s.dateDeclaration, disabled: true }),
            type: new FormControl({ value: s.type, disabled: true }),
            lieu: new FormControl({ value: s.lieu, disabled: true }),
            numeroAssurence: new FormControl({ value: s.numeroAssurence, disabled: true }),
            agenceClient: new FormControl({ value: s.agenceClient, disabled: true }),
            // Informations sur l'adversaire (si disponibles)
            prenomAdversaire: new FormControl({ value: s.prenomAdversaire, disabled: true }),
            nomAdversaire: new FormControl({ value: s.nomAdversaire, disabled: true }),
            numeroAssurenceAdversaire: new FormControl({ value: s.numeroAssurenceAdversaire, disabled: true }),
            matriculeAdvr: new FormControl({ value: s.matriculeAdvr, disabled: true }),
            marqueVoitureAdvr: new FormControl({ value: s.marqueVoitureAdvr, disabled: true }),
            agenceAdvr: new FormControl({ value: s.agenceAdvr, disabled: true }),
            // Liste des images
            images: new FormControl({ value: s.images || [], disabled: true })
          }));
        });
       
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des sinistres:', err);
        this.loading = false;
      }
    });
  }
 
  /**
   * Retourne la couleur associée à l'état du sinistre.
   * @param statut - Statut du sinistre
   */
  getStatutColor(statut: SinistreStatut | null | undefined): string {
    if (!statut) return 'grey';
   
    switch (statut) {
      case SinistreStatut.VALIDE:
        return 'green';
      case SinistreStatut.REFUSE:
        return 'red';
      case SinistreStatut.EN_ATTENTE:
        return 'orange';
      case SinistreStatut.CLOTURE:
        return 'blue';
      default:
        return 'grey';
    }
  }
 
  /**
   * Formate le statut pour l'affichage
   */
  formatStatut(statut: SinistreStatut | null | undefined): string {
    if (!statut) return 'Inconnu';
    return statut.charAt(0).toUpperCase() + statut.slice(1).toLowerCase();
  }
 
  /**
   * Rafraîchit la liste des sinistres
   */
  refreshSinistres(): void {
    this.loadSinistreStatus();
  }
 
  /**
   * Obtient l'URL complète d'une image
   */
  getImageUrl(filename: string): string {
    return this.sinistreService.getImageUrl(filename);
  }
 
  /**
   * Vérifie si un sinistre a des informations sur l'adversaire
   */
  hasAdversaireInfo(index: number): boolean {
    const sinistre = this.sinistresData[index];
    if (!sinistre) return false;
   
    return !!(sinistre.prenomAdversaire || sinistre.nomAdversaire ||
              sinistre.numeroAssurenceAdversaire || sinistre.matriculeAdvr ||
              sinistre.marqueVoitureAdvr || sinistre.agenceAdvr);
  }
 
  /**
   * Vérifie si un champ existe et a une valeur
   */
  hasValue(value: any): boolean {
    return value !== null && value !== undefined && value !== '';
  }
 
  /**
   * Extrait le type de glace endommagée du commentaire
   */
  extractGlacesFromComment(commentaire: string | null | undefined): string[] {
    if (!commentaire) return [];
   
    const match = commentaire.match(/Glace\(s\) endommagée\(s\): (.*?)(?:\.|$)/);
    if (match && match[1]) {
      return match[1].split(', ').map(item => item.trim()).filter(item => item.length > 0);
    }
    return [];
  }
 
  /**
   * Extrait les commentaires additionnels
   */
  extractAdditionalComments(commentaire: string | null | undefined): string {
    if (!commentaire) return '';
   
    const match = commentaire.match(/Commentaires additionnels: (.*?)(?:\.|$)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    return '';
  }
 
  /**
   * Gère le clic sur une image pour l'agrandir
   */
  handleImageClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target && target.classList) {
      target.classList.toggle('expanded');
    }
  }
}