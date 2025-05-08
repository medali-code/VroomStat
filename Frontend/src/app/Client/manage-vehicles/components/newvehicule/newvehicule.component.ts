import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CreateVehiculeRequest, VehiculeService } from '../../../../Services/vehicule.service';

@Component({
  selector: 'app-newvehicule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './newvehicule.component.html',
  styleUrls: ['./newvehicule.component.css']
})
export class NewvehiculeComponent implements OnInit {
  vehiculeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehiculeService: VehiculeService,
    private dialogRef: MatDialogRef<NewvehiculeComponent>, // Correction ici: type correctement spécifié
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.vehiculeForm = this.fb.group({
      marque: ['', Validators.required],
      modele: ['', Validators.required],
      immatriculation: ['', Validators.required],
      couleur: ['Non spécifiée', Validators.required],
      annee: ['2023', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
      proprietaireId: [''],
    });
  
    // Reste du code...
  

    // Si on est en mode édition, pré-remplir le formulaire
    if (this.data) {
      this.vehiculeForm.patchValue({
        marque: this.data.marque,
        modele: this.data.modele,
        immatriculation: this.data.immatriculation,
        couleur: this.data.couleur,
        annee: this.data.annee,
        proprietaireId: this.data.proprietaireId
      });
    }
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
      console.log('Payload décodé:', decodedPayload);
      return decodedPayload.sub || decodedPayload.id; // Essaie 'sub' ou 'id'
    } catch (error) {
      console.error('Erreur lors de l\'extraction du token:', error);
      return null;
    }
  }

  onSubmit(): void {
    console.log('Formulaire soumis');
    console.log('État du formulaire:', this.vehiculeForm.value);
    console.log('Formulaire valide:', this.vehiculeForm.valid);
    
    // Débogage détaillé de chaque champ du formulaire
    Object.keys(this.vehiculeForm.controls).forEach(key => {
      const control = this.vehiculeForm.get(key);
      console.log(`Champ ${key}: ${control?.valid ? 'valide' : 'invalide'}`);
      if (control?.invalid) {
        console.log(`Erreurs pour ${key}:`, control.errors);
      }
    });
    
    if (this.vehiculeForm.invalid) {
      console.log('Formulaire invalide - arrêt du traitement');
      this.vehiculeForm.markAllAsTouched();
      return;
    }
  
    const userId = this.getUserIdFromToken();
    console.log('ID utilisateur récupéré:', userId);
    
    if (!userId) {
      console.error('Impossible de récupérer l\'ID utilisateur depuis le token.');
      return;
    }
    
    // Cloner les valeurs du formulaire pour ne pas modifier l'original
    const vehiculeData: CreateVehiculeRequest = {...this.vehiculeForm.value, proprietaireId: userId};
    console.log('Données du véhicule à envoyer:', vehiculeData);

    if (this.data && this.data.id) {
      // Mode mise à jour
      console.log(`Mise à jour du véhicule avec ID: ${this.data.id}`);
      this.vehiculeService.updateVehicule(this.data.id, vehiculeData).subscribe({
        next: (result) => {
          console.log('Véhicule mis à jour avec succès:', result);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de la mise à jour du véhicule:', error);
        }
      });
    } else {
      // Mode création
      console.log('Création d\'un nouveau véhicule');
      this.vehiculeService.createVehicule(vehiculeData).subscribe({
        next: (result) => {
          console.log('Véhicule ajouté avec succès:', result);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Erreur lors de la création du véhicule:', error);
        }
      });
    }
  }

  closeForm(): void {
    console.log('Fermeture du formulaire');
    this.dialogRef.close(false);
  }
}