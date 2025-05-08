// submit-review.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavClientComponent } from '../../Commun/nav-client/nav-client.component';
import { AvisService } from '../../Services/avis.service'; 

@Component({
  selector: 'app-submit-review',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavClientComponent],
  templateUrl: './submit-review.component.html',
  styleUrls: ['./submit-review.component.css']
})
export class SubmitReviewComponent implements OnInit {
  reviewForm!: FormGroup;
  submitted: boolean = false;

  constructor(private fb: FormBuilder, private avisService: AvisService) {}

  ngOnInit(): void {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      commentaire: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    console.log("Form submitted");

    if (this.reviewForm.invalid) {
      return;
    }
  
    const avisPayload = {
      note: this.reviewForm.value.rating,
      commentaire: this.reviewForm.value.commentaire,
      clientId: this.getUserIdFromToken() // Récupération de l'ID du client depuis le token
    };
  
    this.avisService.createAvis(avisPayload).subscribe({
      next: (result) => {
        console.log("Avis created:", result);
        alert("Merci pour votre avis !");
        this.reviewForm.reset();
        this.submitted = false;
      },
      error: (error) => {
        console.error("Erreur lors de la création de l'avis:", error);
        alert("Erreur lors de la soumission de l'avis !");
      }
    });
  }

  getUserIdFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Aucun token trouvé dans le localStorage');
      return null;
    }

    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payloadBase64));
      return decodedPayload.sub || decodedPayload.id;
    } catch (error) {
      console.error('Erreur lors de l\'extraction du token:', error);
      return null;
    }
  }
}