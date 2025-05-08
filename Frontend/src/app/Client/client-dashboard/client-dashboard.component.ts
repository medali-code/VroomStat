import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, RouterLinkWithHref, RouterModule } from '@angular/router';
import { NavClientComponent } from '../../Commun/nav-client/nav-client.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AvisService, Avis } from '../../Services/avis.service'; // Importez Avis et AvisService

@Component({
  selector: 'app-client-dashboard', // Assurez-vous que le sélecteur correspond à l'endroit où vous utilisez ce composant
  standalone: true,
  imports: [ReactiveFormsModule, NavClientComponent, RouterModule,RouterLink],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  contactForm!: FormGroup;
  listeAvis: Avis[] = []; // Déclarez une variable pour stocker tous les avis

  constructor(private avisService: AvisService) {}

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      nom: new FormControl('', Validators.required),
      telephone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required)
    });
    this.loadAvis(); // Chargez la liste des avis au chargement du composant
  }

  loadAvis(): void {
    this.avisService.getAllAvis().subscribe(response => {
      console.log('Réponse de l\'API:', response);
      this.listeAvis = response.data; // Maintenant 'response' est de type ApiResponse
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // Logique de traitement du formulaire
      console.log('Données du formulaire:', this.contactForm.value);
    } else {
      console.log('Formulaire invalide');
    }
  }

  // Fonction utilitaire pour générer un tableau de nombres pour l'affichage des étoiles
  getArrayFromNumber(n: number): number[] {
    return Array(n).fill(0).map((_, index) => index + 1);
  }
}