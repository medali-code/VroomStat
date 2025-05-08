import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NavClientComponent } from '../../Commun/nav-client/nav-client.component';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../Services/client.service';
import { environment } from '../../../environments/environment'; // Importez l'environnement

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavClientComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  profileImageUrl: SafeUrl = 'assets/images/default-profile.jpg'; // Changé pour utiliser une image locale
  defaultImageUrl: SafeUrl = 'assets/images/default-profile.jpg'; // Changé pour utiliser une image locale
  saving: boolean = false;
  message: string = '';
  imageChanged: boolean = false;
  originalFormValues: any = {};
  imageLoadError: boolean = false;
  
  // Ajout d'une variable pour l'URL du backend
  private apiBaseUrl = 'http://localhost:3000';

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private clientService: ClientService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''], // Not required for updates
      address: ['', Validators.required]
    });

    const userId = this.getUserIdFromToken();
    if (userId) {
      this.clientService.getClientById(userId).subscribe(
        response => {
          console.log('Client data received:', response);
          if (response && response.data) {
            const client = response.data;
            console.log('Patching form with:', {
              lastName: client.nom,
              firstName: client.prenom,
              phone: client.telephone,
              email: client.email,
              address: client.adresse
            });
            
            // Update form with client data
            this.profileForm.patchValue({
              lastName: client.nom,
              firstName: client.prenom,
              phone: client.telephone,
              email: client.email,
              address: client.adresse
            });
            
            // Store original values for comparison later
            this.originalFormValues = this.profileForm.value;
      
            if (client.photoProfil) {
              // Si la photo de profil existe, on la charge
              this.loadProfileImage(client.photoProfil);
            }
          } else {
            console.error('Format de réponse invalide:', response);
            this.message = 'Erreur de format de données.';
          }
        },
        error => {
          console.error('Erreur lors de la récupération des données utilisateur : ', error);
          this.message = 'Une erreur est survenue lors de la récupération de vos données.';
        }
      );
    }
  }

  // Méthode améliorée pour gérer le chargement d'image avec gestion d'erreur robuste
  loadProfileImage(imageUrl: string): void {
    // Vérifier si l'URL est un Data URL (base64)
    if (imageUrl && imageUrl.startsWith('data:')) {
      try {
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        this.imageLoadError = false;
        return;
      } catch (e) {
        console.error('Erreur avec l\'URI data:', e);
        this.useDefaultImage();
        return;
      }
    }
    
    // Formatage de l'URL
    let formattedUrl = imageUrl;
    
    // Si c'est un chemin relatif, ajouter l'URL de base
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      // Nettoyer le chemin en supprimant les barres obliques au début si présentes
      const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
      formattedUrl = `${this.apiBaseUrl}/${cleanPath}`;
    }
    
    // Créer un nouvel élément Image pour tester si l'image peut être chargée
    const img = new Image();
    
    // Définir un délai d'attente pour le chargement de l'image
    const timeoutId = setTimeout(() => {
      img.src = ''; // Annuler le chargement
      this.useDefaultImage();
      console.error('Timeout lors du chargement de l\'image:', formattedUrl);
    }, 5000); // 5 secondes de timeout
    
    img.onload = () => {
      clearTimeout(timeoutId);
      // Si l'image se charge avec succès, l'utiliser
      this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(formattedUrl);
      this.imageLoadError = false;
    };
    
    img.onerror = () => {
      clearTimeout(timeoutId);
      this.useDefaultImage();
      console.error('Impossible de charger l\'image de profil:', formattedUrl);
    };
    
    // Démarrer le chargement de l'image
    img.src = formattedUrl;
  }
  
  // Méthode pour utiliser l'image par défaut
  private useDefaultImage(): void {
    this.profileImageUrl = this.defaultImageUrl;
    this.imageLoadError = true;
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

  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Vérification de la taille de l'image (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.message = 'La taille de l\'image ne doit pas dépasser 5 MB.';
        return;
      }
      
      // Vérification du type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.message = 'Format d\'image non supporté. Utilisez JPG, PNG ou GIF.';
        return;
      }
      
      const reader = new FileReader();
      reader.onload = e => {
        this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(e.target?.result as string);
        this.imageChanged = true;
        this.imageLoadError = false;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.saving = true;
      this.message = '';

      const userId = this.getUserIdFromToken();
      if (!userId) {
        this.saving = false;
        this.message = 'Impossible de récupérer l\'ID de l\'utilisateur.';
        return;
      }

      // Check if only the image has changed
      const imageInput = document.getElementById('profileImageInput') as HTMLInputElement;
      const hasImageFile = imageInput?.files && imageInput.files.length > 0;
      
      // Check if any form field has changed
      const formChanged = Object.keys(this.profileForm.value).some(key => {
        // Skip password if empty
        if (key === 'password' && !this.profileForm.value[key]) return false;
        // Check if value has changed from original
        return this.profileForm.value[key] !== this.originalFormValues[key];
      });
      
      // If only the image has changed or any form field has changed
      if (this.imageChanged || formChanged) {
        const formData = new FormData();
        
        // Only add changed fields to formData
        if (this.profileForm.value.lastName !== this.originalFormValues.lastName) {
          formData.append('nom', this.profileForm.value.lastName);
        }
        
        if (this.profileForm.value.firstName !== this.originalFormValues.firstName) {
          formData.append('prenom', this.profileForm.value.firstName);
        }
        
        if (this.profileForm.value.phone !== this.originalFormValues.phone) {
          formData.append('telephone', this.profileForm.value.phone);
        }
        
        if (this.profileForm.value.email !== this.originalFormValues.email) {
          formData.append('email', this.profileForm.value.email);
        }
        
        if (this.profileForm.value.address !== this.originalFormValues.address) {
          formData.append('adresse', this.profileForm.value.address);
        }
        
        // Only append password if provided
        if (this.profileForm.value.password) {
          formData.append('motDePasse', this.profileForm.value.password);
        }
        
        // Append the image file if it has been changed
        if (hasImageFile && imageInput.files) {
          formData.append('photoProfil', imageInput.files[0]);
        }
        
        this.clientService.updateClientProfile(userId, formData).subscribe(
          (response) => {
            this.saving = false;
            this.message = 'Profil mis à jour avec succès !';
            console.log('Réponse du serveur : ', response);
            
            // Update original values after successful save
            this.originalFormValues = {...this.profileForm.value};
            this.imageChanged = false;
          },
          (error) => {
            this.saving = false;
            this.message = "Une erreur s'est produite lors de la mise à jour du profil.";
            console.error('Erreur : ', error);
          }
        );
      } else {
        this.saving = false;
        this.message = 'Aucune modification détectée.';
      }
    } else {
      this.profileForm.markAllAsTouched();
      this.message = 'Veuillez remplir correctement tous les champs requis.';
    }
  }
}