import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { NavAdminComponent } from "../../Commun/nav-admin/nav-admin.component";
import { Sinistre, SinistreStatut, SinistreService, SinistreApiResponse } from '../../Services/sinistre.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-manage-sinistres',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatExpansionModule,
    MatChipsModule,
    MatTooltipModule,
    MatButtonToggleModule,
    NavAdminComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './manage-sinistres.component.html',
  styleUrls: ['./manage-sinistres.component.css']
})
export class ManageSinistresComponent implements OnInit {
  sinistres: Sinistre[] = [];
  sinistresFiltres: Sinistre[] = [];
  isLoading = false;
  
  // Filtre par défaut sur EN_ATTENTE
  filtreStatut: SinistreStatut | 'TOUS' = SinistreStatut.EN_ATTENTE;
  
  // Utiliser le enum pour les statuts
  statuts = SinistreStatut;

  constructor(
    private fb: FormBuilder,
    private sinistreService: SinistreService
  ) {}

  ngOnInit(): void {
    this.loadSinistres();
  }

  /**
   * Charge tous les sinistres depuis le service
   */
  loadSinistres(): void {
    this.isLoading = true;
    this.sinistreService.getSinistres()
      .pipe(
        catchError(error => {
          console.error('Erreur lors du chargement des sinistres', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: 'Impossible de charger les sinistres.',
          });
          return of({ data: [] } as SinistreApiResponse);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((response: SinistreApiResponse) => {
        this.sinistres = response.data || [];
        this.filtrerSinistres();
      });
  }

  /**
   * Filtre les sinistres selon le statut sélectionné
   */
  filtrerSinistres(): void {
    if (this.filtreStatut === 'TOUS') {
      this.sinistresFiltres = [...this.sinistres];
    } else {
      this.sinistresFiltres = this.sinistres.filter(s => s.statut === this.filtreStatut);
    }
  }

  /**
   * Obtient le libellé du filtre actuel pour le message "Aucun sinistre trouvé"
   */
  getFilterLabel(): string {
    switch (this.filtreStatut) {
      case SinistreStatut.EN_ATTENTE:
        return 'en attente';
      case SinistreStatut.VALIDE:
        return 'validé';
      default:
        return '';
    }
  }

  /**
   * Valide un sinistre en attente
   */
  validateSinistre(sinistre: Sinistre): void {
    if (sinistre.statut === SinistreStatut.EN_ATTENTE && sinistre.id) {
      this.isLoading = true;
      this.sinistreService.accepterSinistre(sinistre.id)
        .pipe(
          catchError(error => {
            console.error('Erreur lors de la validation du sinistre', error);
            Swal.fire({
              icon: 'error',
              title: 'Erreur!',
              text: 'Impossible de valider le sinistre.',
            });
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe(updatedSinistre => {
          if (updatedSinistre) {
            // Mettre à jour le sinistre dans la liste locale
            const index = this.sinistres.findIndex(s => s.id === sinistre.id);
            if (index !== -1) {
              this.sinistres[index] = updatedSinistre;
            }
            
            // Mettre à jour la liste filtrée
            this.filtrerSinistres();
            
            Swal.fire({
              icon: 'success',
              title: 'Validé!',
              text: `Le sinistre a été validé avec succès.`,
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
    }
  }

  /**
   * Supprime un sinistre avec confirmation
   */
  deleteSinistre(sinistre: Sinistre): void {
    if (!sinistre.id) {
      console.error('ID de sinistre manquant');
      return;
    }
    
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: `Voulez-vous vraiment supprimer ce sinistre ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.sinistreService.deleteSinistre(sinistre.id!)
          .pipe(
            catchError(error => {
              console.error('Erreur lors de la suppression du sinistre', error);
              Swal.fire({
                icon: 'error',
                title: 'Erreur!',
                text: 'Impossible de supprimer le sinistre.',
              });
              return of(null);
            }),
            finalize(() => {
              this.isLoading = false;
            })
          )
          .subscribe(response => {
            // Même si la réponse est différente, on filtre localement
            this.sinistres = this.sinistres.filter(s => s.id !== sinistre.id);
            
            // Mettre à jour la liste filtrée
            this.filtrerSinistres();
            
            Swal.fire({
              icon: 'success',
              title: 'Supprimé!',
              text: `Le sinistre a été supprimé avec succès.`,
              timer: 1500,
              showConfirmButton: false
            });
          });
      }
    });
  }

  /**
   * Fonction pour afficher le statut en français
   */
  getStatusLabel(statut: SinistreStatut): string {
    switch (statut) {
      case SinistreStatut.EN_ATTENTE:
        return 'En attente';
      case SinistreStatut.VALIDE:
        return 'Validé';
      case SinistreStatut.REFUSE:
        return 'Refusé';
      case SinistreStatut.CLOTURE:
        return 'Clôturé';
     
    }
  }

  /**
   * Vérifie si un sinistre a des informations sur l'adversaire
   */
  hasAdversaireInfo(sinistre: Sinistre): boolean {
    return !!(
      sinistre.prenomAdversaire || 
      sinistre.nomAdversaire ||
      sinistre.numeroAssurenceAdversaire || 
      sinistre.matriculeAdvr ||
      sinistre.marqueVoitureAdvr || 
      sinistre.agenceAdvr
    );
  }

  /**
   * Obtient l'URL complète d'une image
   */
  getImageUrl(filename: string): string {
    // Utiliser la fonction du service sinistre si disponible, sinon construire l'URL
    if (this.sinistreService.getImageUrl) {
      return this.sinistreService.getImageUrl(filename);
    }
    return `assets/uploads/${filename}`;
  }

  /**
   * Gère le clic sur une image pour l'agrandir
   */
  handleImageClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target && target.classList) {
      target.classList.toggle('expanded');
      
      // Si l'image est agrandie, ajouter un gestionnaire de clic pour la fermer
      if (target.classList.contains('expanded')) {
        const clickOutsideHandler = (e: MouseEvent) => {
          if (e.target !== target) {
            target.classList.remove('expanded');
            document.removeEventListener('click', clickOutsideHandler);
          }
        };
        
        setTimeout(() => {
          document.addEventListener('click', clickOutsideHandler);
        }, 10);
      }
    }
  }
}