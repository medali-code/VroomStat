import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NavClientComponent } from '../../Commun/nav-client/nav-client.component';
import { SinistreService, SinistreStatut, PieceType, Sinistre } from '../../Services/sinistre.service'; // Import Sinistre interface
import { Router } from '@angular/router';
import { Vehicule, VehiculeService } from '../../Services/vehicule.service';
import { finalize, catchError } from 'rxjs/operators'; // Import catchError
import { forkJoin, Observable, of } from 'rxjs'; // Import forkJoin and of for managing multiple uploads

@Component({
  selector: 'app-declarer-sinistre',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavClientComponent],
  templateUrl: './declarer-sinistre.component.html',
  styleUrls: ['./declarer-sinistre.component.css']
})
export class DeclarerSinistreComponent implements OnInit {

  declarerSinistreForm!: FormGroup;
  submitting = false;
  errorMessage = '';
  userVehicules: Vehicule[] = [];
  loadingVehicules = false;
  selectedImages: File[] = [];
  imagePreviewUrls: string[] = [];
  maxImageSize = 5 * 1024 * 1024; // 5MB en octets
  allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

  glaceOptions = [
    { label: 'Custode Avant droite', value: 'Custode Avant droite' as PieceType },
    { label: 'Custode Avant gauche', value: 'Custode Avant gauche' as PieceType },
    { label: 'Déflecteur Arrière droite', value: 'Déflecteur Arrière droite' as PieceType },
    { label: 'Déflecteur Arrière gauche', value: 'Déflecteur Arrière gauche' as PieceType },
    { label: 'Lunette Arrière droite', value: 'Lunette Arrière droite' as PieceType },
    { label: 'Lunette Arrière gauche', value: 'Lunette Arrière gauche' as PieceType },
    { label: 'Lunette Arrière', value: 'Lunette Arrière' as PieceType },
    { label: 'Pare-brise', value: 'Pare-brise' as PieceType },
    { label: 'Vitre Arrière droite', value: 'Vitre Arrière droite' as PieceType },
    { label: 'Vitre Arrière gauche', value: 'Vitre Arrière gauche' as PieceType },
    { label: 'Vitre Avant droite', value: 'Vitre Avant droite' as PieceType },
    { label: 'Vitre Avant gauche', value: 'Vitre Avant gauche' as PieceType },
    { label: 'Vitre Latérale droite', value: 'Vitre Latérale droite' as PieceType },
    { label: 'Vitre Latérale gauche', value: 'Vitre Latérale gauche' as PieceType }
  ];

  constructor(
    private fb: FormBuilder,
    private sinistreService: SinistreService,
    private router: Router,
    private vehiculeService: VehiculeService
  ) {}

  ngOnInit(): void {
    this.declarerSinistreForm = this.fb.group({
      dateSinistre: ['', Validators.required],
      lieuSinistre: ['', Validators.required],

      matriculeAdvr: [''],
      marqueVoitureAdvr: [''],
      agenceAdvr: [''],

      agenceClient: ['', Validators.required],
      numeroAssurence: ['', Validators.required],
      numeroAssurenceAdversaire: [''],
      prenomAdversaire: [''],
      nomAdversaire: [''],
      vehiculeId: ['', Validators.required],
      immatriculation: [''], // This field is just for display/auto-fill, not part of the DTO
      glaceEndommagee: this.createCheckboxes(),
      commentaires: [''],
      certification: [false, Validators.requiredTrue]
    });

    this.loadUserVehicules();

    // Auto-remplir immatriculation lorsque véhicule sélectionné
    this.declarerSinistreForm.get('vehiculeId')?.valueChanges.subscribe((vehiculeId: string) => {
      const selectedVehicule = this.userVehicules.find(v => v.id === vehiculeId);
      if (selectedVehicule) {
        this.declarerSinistreForm.patchValue({ immatriculation: selectedVehicule.immatriculation });
      } else {
         this.declarerSinistreForm.patchValue({ immatriculation: '' }); // Clear if no vehicle selected
      }
    });
  }

  private createCheckboxes(): FormArray {
    const controls = this.glaceOptions.map(() => this.fb.control(false));
    return this.fb.array(controls, this.minCheckedRequired(1));
  }

  private minCheckedRequired(min: number): ValidatorFn {
    return (control: AbstractControl) => {
      const formArray = control as FormArray;
      const checkedCount = formArray.controls.reduce((sum, ctrl) => ctrl.value ? sum + 1 : sum, 0);
      return checkedCount >= min ? null : { required: true };
    };
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
      // console.log('Payload décodé:', decodedPayload); // Log removed for production
      return decodedPayload.sub || decodedPayload.id; // Assuming 'sub' or 'id' holds the user ID
    } catch (error) {
      console.error('Erreur lors de l\'extraction du token:', error);
      return null;
    }
  }

  loadUserVehicules(): void {
    const userId = this.getUserIdFromToken();
    if (!userId) {
      this.errorMessage = 'Impossible de récupérer l\'ID utilisateur.';
      return;
    }

    this.loadingVehicules = true; // Set loading state
    this.vehiculeService.getVehiculesByUserId(userId).pipe(
       finalize(() => this.loadingVehicules = false) // Reset loading state
    ).subscribe({
      next: (response: any) => {
        console.log('Véhicules reçus:', response);
        // Extract the array from the response.data
        this.userVehicules = response.data || [];
        // Select the first vehicle by default if available
        if (this.userVehicules.length > 0) {
          this.declarerSinistreForm.get('vehiculeId')?.setValue(this.userVehicules[0].id);
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des véhicules:', error);
        this.errorMessage = 'Impossible de charger vos véhicules.';
      }
    });
  }

  private buildCommentaire(formValue: any, selectedGlaces: PieceType[]): string {
    let commentaire = `Glace(s) endommagée(s): ${selectedGlaces.join(', ')}`;
    if (formValue.commentaires && formValue.commentaires.trim()) {
      commentaire += `. Commentaires additionnels: ${formValue.commentaires.trim()}`;
    }
    return commentaire;
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const files = Array.from(input.files);
    let hasError = false;
    let tempSelectedImages: File[] = []; // Use temporary array for validation first

    files.forEach(file => {
      // Vérifier le type de fichier
      if (!this.allowedImageTypes.includes(file.type)) {
        this.errorMessage = `Type de fichier non autorisé: ${file.name}. Seuls jpg, jpeg, png et gif sont acceptés.`;
        hasError = true;
        return;
      }

      // Vérifier la taille du fichier
      if (file.size > this.maxImageSize) {
        this.errorMessage = `Fichier trop volumineux: ${file.name}. Taille maximale: 5MB.`;
        hasError = true;
        return;
      }
      tempSelectedImages.push(file); // Add to temp if valid
    });

    if (hasError) {
      // Réinitialiser l'input file
      input.value = '';
      // Clear current selections if any file failed validation
      this.selectedImages = [];
      this.imagePreviewUrls = [];
      return;
    }

    // If all files are valid, add them to the actual lists
    this.selectedImages = tempSelectedImages;
    this.imagePreviewUrls = []; // Clear previews before adding new ones

    this.selectedImages.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviewUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
    });


    this.errorMessage = ''; // Clear previous errors
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
     // If the input file element has a value, reset it so the same file can be selected again later if needed
     const fileInput = document.getElementById('photoVitre') as HTMLInputElement;
     if (fileInput) {
         fileInput.value = '';
     }
  }

  // Fixed onSubmit method
// ... (previous imports and class definition)

onSubmit(): void {
  if (this.declarerSinistreForm.invalid) {
    console.log('Le formulaire n\'est pas valide.');
    this.declarerSinistreForm.markAllAsTouched(); // Mark all fields to show validation errors
    this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire.';
    return; // Stop if form is invalid
  }

  this.submitting = true;
  this.errorMessage = ''; // Clear previous errors

  const formValue = this.declarerSinistreForm.value;
  const selectedGlaces = this.glaceOptions
    .filter((_, index) => formValue.glaceEndommagee[index])
    .map(option => option.value);

  // Choose the first selected piece type as the primary 'type'
  const primaryType: PieceType = selectedGlaces.length > 0 ? selectedGlaces[0] : this.glaceOptions[0].value; // Default if somehow none selected despite validation

  const clientId = this.getUserIdFromToken();
   if (!clientId) {
      this.errorMessage = "ID client introuvable. Veuillez vous reconnecter.";
      this.submitting = false;
      return;
   }
  const vehiculeId = formValue.vehiculeId;

  const sinistreDto = {
    dateDeclaration: new Date(formValue.dateSinistre).toISOString(),
    lieu: formValue.lieuSinistre,
    commentaire: this.buildCommentaire(formValue, selectedGlaces),
    numeroAssurence: formValue.numeroAssurence,
    numeroAssurenceAdversaire: formValue.numeroAssurenceAdversaire,
    prenomAdversaire: formValue.prenomAdversaire,
    nomAdversaire: formValue.nomAdversaire,
    matriculeAdvr: formValue.matriculeAdvr,
    marqueVoitureAdvr: formValue.marqueVoitureAdvr,
    agenceAdvr: formValue.agenceAdvr,
    agenceClient: formValue.agenceClient,
    type: primaryType, // Use the primary selected type
    // statut and images are handled by the backend on creation
    clientId: clientId,
    vehiculeId: vehiculeId
  };

  console.log("DTO Sinistre avant création:", sinistreDto);

  // The createSinistre service method should return the structured response object
  this.sinistreService.createSinistre(sinistreDto)
    .pipe(
      // No finalize here, it's done after potential image upload
    )
    .subscribe({
      // Expecting the structured response: { data: Sinistre, message: string, statusCode: number }
      next: (response: any) => { // Use 'any' here to easily access response.data
        console.log('Réponse complète après création:', response); // Log full response

        // Check if the sinistre was created successfully and has an ID inside the 'data' property
        if (response && response.data && response.data.id) {
          const createdSinistre = response.data as Sinistre; // Cast data to Sinistre type
          const sinistreId = createdSinistre.id;

          console.log('Sinistre créé avec succès. ID:', sinistreId); // Log the extracted ID

          // If images were selected, upload them using the new sinistre ID
          if (this.selectedImages.length > 0) {
            this.uploadImages(sinistreId!); // Call uploadImages helper
          } else {
            // No images to upload, navigate directly
            this.submitting = false; // End submitting state
            this.router.navigate(['/client/sinistres']);
          }
        } else {
          // Handle case where creation succeeded but the response structure is unexpected
          this.errorMessage = 'Sinistre créé, mais structure de réponse inattendue. ID manquant.';
           console.error('Structure de réponse inattendue après création:', response);
          this.submitting = false;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la création du sinistre:', error);
        this.errorMessage = 'Une erreur est survenue lors de la création du sinistre: ' +
          (error.error?.message || error.message || 'Erreur inconnue');
        this.submitting = false; // End submitting state on creation error
      }
    });
}

// ... (the rest of the component methods remain the same)



  
// PART 3: Update the uploadImages method in declarer-sinistre.component.ts
// Improve error handling and make sure field names match
private uploadImages(sinistreId: string): void {
  if (!sinistreId || this.selectedImages.length === 0) {
    this.submitting = false;
    this.router.navigate(['/client/sinistres']);
    return;
  }

  console.log(`Début de l'upload des ${this.selectedImages.length} images pour le sinistre ${sinistreId}`);

  // Choose the upload approach based on number of images
  const uploadObservable = this.selectedImages.length === 1
    ? this.uploadSingleImage(sinistreId, this.selectedImages[0])
    : this.uploadMultipleImages(sinistreId, this.selectedImages);

  uploadObservable.pipe(
    finalize(() => {
      this.submitting = false;
    }),
    catchError((error) => {
      console.error('Erreur lors de l\'upload des images:', error);
      
      // Provide more detailed error information
      let errorMsg = 'Le sinistre a été créé, mais une erreur est survenue lors de l\'upload des images: ';
      if (error.error && error.error.message) {
        errorMsg += error.error.message;
      } else if (error.message) {
        errorMsg += error.message;
      } else {
        errorMsg += 'Erreur inconnue';
      }
      
      this.errorMessage = errorMsg;
      this.router.navigate(['/client/sinistres']);
      return of(null);
    })
  ).subscribe({
    next: (response) => {
      if (response !== null) {
        console.log('Upload des images réussi:', response);
        this.router.navigate(['/client/sinistres']);
      }
    }
  });
}
private uploadSingleImage(sinistreId: string, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Add logging to debug request
  console.log('Sending single file upload request with field name: file');
  
  return this.sinistreService.uploadImage(sinistreId, file);
}

private uploadMultipleImages(sinistreId: string, files: File[]): Observable<any> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  
  // Add logging to debug request
  console.log('Sending multiple files upload request with field name: files');
  
  return this.sinistreService.uploadMultipleImages(sinistreId, files);
}

}