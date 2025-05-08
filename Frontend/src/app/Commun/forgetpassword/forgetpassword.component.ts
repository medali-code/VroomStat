import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetPasswordComponent {
  forgetForm: FormGroup;
  message: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgetForm.valid) {
      const email: string = this.forgetForm.value.email;
      this.authService.resetPassword(email).subscribe({
        next: (response: { message: string }) => {
          this.message = response.message;
          this.errorMessage = '';
          this.forgetForm.reset(); // Optionnel : réinitialiser le formulaire après soumission
        },
        error: (error: any) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la réinitialisation du mot de passe';
          this.message = '';
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.forgetForm.markAllAsTouched();
    }
  }
}
