// manage-reviews.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavAdminComponent } from "../../Commun/nav-admin/nav-admin.component";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Avis, AvisService } from '../../Services/avis.service';

@Component({
  selector: 'app-manage-reviews',
  templateUrl: './manage-reviews.component.html',
  styleUrls: ['./manage-reviews.component.css'],
  standalone: true,
  imports: [CommonModule, NavAdminComponent, ReactiveFormsModule]
})
export class ManageReviewsComponent implements OnInit {
  reviews: Avis[] = [];
  reviewForm: FormGroup;
  loading = false;

  constructor(private fb: FormBuilder, private avisService: AvisService) {
    this.reviewForm = this.fb.group({
      user: ['', Validators.required],
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', Validators.required],
      statut: ['pending']
    });
  }

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.loading = true;
    this.avisService.getAllAvis().subscribe({
      next: (response) => {
        if (response && Array.isArray(response.data)) {
          this.reviews = response.data.map((avis: any) => ({
            id: avis.id,
            user: avis.client?.nom || 'Client inconnu',
            note: avis.note,
            commentaire: avis.commentaire,
            date: avis.date,
            statut: avis.statut,
          }));
        } else {
          console.error('Format de réponse inattendu:', response);
          this.reviews = [];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des avis:', error);
        Swal.fire('Erreur', 'Impossible de charger les avis.', 'error');
        this.loading = false;
      }
    });
  }

  onAddReview(): void {
    if (this.reviewForm.valid) {
      const reviewData = {
        clientId: this.reviewForm.value.user,
        note: this.reviewForm.value.rating,
        commentaire: this.reviewForm.value.comment,
        statut: this.reviewForm.value.statut
      };

      this.avisService.createAvis(reviewData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Avis ajouté avec succès', 'success');
          this.reviewForm.reset({statut: 'pending'});
          this.loadReviews();
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'avis:', error);
          Swal.fire('Erreur', 'Impossible d\'ajouter l\'avis.', 'error');
        }
      });
    } else {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires.', 'error');
    }
  }

  approveReview(review: Avis): void {
    this.updateReviewStatus(review.id!, 'approved');
  }

  rejectReview(review: Avis): void {
    this.updateReviewStatus(review.id!, 'rejected');
  }

  updateReviewStatus(reviewId: string, newStatus: 'approved' | 'rejected'): void {
    if (!reviewId) {
      console.error('ID d\'avis manquant');
      Swal.fire('Erreur', 'ID d\'avis invalide', 'error');
      return;
    }

    this.avisService.updateAvis(reviewId, { statut: newStatus }).subscribe({
      next: (updatedReview) => {
        this.reviews = this.reviews.map(r => 
          r.id === reviewId ? { ...r, statut: newStatus } : r
        );
        const statusText = newStatus === 'approved' ? 'approuvé' : 'rejeté';
        Swal.fire('Statut mis à jour!', `L'avis a été ${statusText}.`, 'success');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        Swal.fire('Erreur', 'Impossible de mettre à jour le statut de l\'avis.', 'error');
      }
    });
  }

  deleteReview(review: Avis): void {
    if (!review || !review.id) {
      console.error('Review invalide ou ID manquant');
      return;
    }

    Swal.fire({
      title: 'Confirmer la suppression',
      text: 'Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.avisService.deleteAvis(review.id!).subscribe({
          next: () => {
            this.reviews = this.reviews.filter(r => r.id !== review.id);
            Swal.fire('Avis supprimé!', '', 'success');
          },
          error: (error) => {
            console.error('Erreur lors de la suppression de l\'avis:', error);
            Swal.fire('Erreur', 'Impossible de supprimer l\'avis.', 'error');
          }
        });
      }
    });
  }
}