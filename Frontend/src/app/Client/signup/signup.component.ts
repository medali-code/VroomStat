import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ClientService, RegisterClientModel } from '../../Services/client.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterModule,FormsModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registerForm!: FormGroup;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', [Validators.required]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Faciliter l'accès aux champs du formulaire
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Arrêter si le formulaire est invalide
    if (this.registerForm.invalid) {
      return;
    }

    const clientData: RegisterClientModel = {
      nom: this.f['nom'].value,
      prenom: this.f['prenom'].value,
      email: this.f['email'].value,
      motDePasse: this.f['motDePasse'].value,
      adresse: this.f['adresse'].value,
      telephone: parseInt(this.f['telephone'].value, 10)
    };

    this.clientService.register(clientData).subscribe({
      next: () => {
        // Redirection vers la page de connexion après inscription réussie
        this.router.navigate(['/client/connexion']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Une erreur est survenue lors de l\'inscription';
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.registerForm.reset();
  }
}