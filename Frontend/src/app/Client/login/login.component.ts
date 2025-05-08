import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { ClientService } from '../../Services/client.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private clientService: ClientService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log('res :', res);

          const userId = this.getUserIdFromToken();
          if (!userId) {
            this.errorMessage = 'Identifiant utilisateur introuvable dans le token.';
            return;
          }

          this.clientService.getClientById(userId).subscribe({
            next: (response) => {
              console.log('Client data received:', response);
              const client = response?.data;
              if (client) {
                if (client.role === 'ADMIN') {
                  this.router.navigate(['/admin/dashboard']);
                } else {
                  this.router.navigate(['/client/dashboard']);
                }
              } else {
                this.errorMessage = 'Utilisateur introuvable.';
              }
            },
            error: (err) => {
              console.error('Erreur lors de la récupération du client:', err);
              this.errorMessage = 'Erreur lors de la récupération des informations utilisateur.';
            }
          });
        },
        error: (err) => {
          console.error('Erreur lors de la connexion :', err.error?.message || err.message);
          this.errorMessage = err.error?.message || 'Erreur lors de la connexion. Veuillez vérifier vos identifiants.';
        }
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
      return decodedPayload.sub || decodedPayload.id;
    } catch (error) {
      console.error('Erreur lors de l\'extraction du token:', error);
      return null;
    }
  }

  redirectToSignUp(): void {
    this.router.navigate(['/client/inscription']);
  }
}
