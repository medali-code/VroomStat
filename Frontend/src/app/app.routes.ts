// Mise à jour des routes
import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './Admin/admin-dashboard/admin-dashboard.component';
import { ManageReviewsComponent } from './Admin/manage-reviews/manage-reviews.component';
import { ManageSinistresComponent } from './Admin/manage-sinistres/manage-sinistres.component';
import { ClientDashboardComponent } from './Client/client-dashboard/client-dashboard.component';
import { DeclarerSinistreComponent } from './Client/declarer-sinistre/declarer-sinistre.component';
import { LoginComponent } from './Client/login/login.component';
import { ManageVehiclesComponent } from './Client/manage-vehicles/manage-vehicles.component';
import { ProfileComponent } from './Client/profile/profile.component';
import { SignupComponent } from './Client/signup/signup.component';
import { SubmitReviewComponent } from './Client/submit-review/submit-review.component';
import { SuiviSinistreComponent } from './Client/suivi-sinistre/suivi-sinistre.component';
import { ForgetPasswordComponent } from './Commun/forgetpassword/forgetpassword.component';
import { HomeComponent } from './Commun/home/home.component';
import { AuthGuard } from './Services/AuthGuard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'forget', component: ForgetPasswordComponent },

  // Admin (protégé par Auth + Role)
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'admin/sinistres', component: ManageSinistresComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' } },
  { path: 'admin/avis', component: ManageReviewsComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'ADMIN' } },

  // Client (protégé par Auth + Role)
  { path: 'client/dashboard', component: ClientDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'USER' } },
  { path: 'client/inscription', component: SignupComponent },
  { path: 'client/connexion', component: LoginComponent },
  { path: 'client/declaration', component: DeclarerSinistreComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'USER' } },
  { path: 'client/vehicules', component: ManageVehiclesComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'USER' } },
  { path: 'client/avis', component: SubmitReviewComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'USER' } },
  { path: 'client/profil', component: ProfileComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'USER' } },
  { path: 'client/sinistres', component: SuiviSinistreComponent, canActivate: [AuthGuard, RoleGuard], data: { expectedRole: 'USER' } },

  // Redirection
  { path: '**', redirectTo: '' }
];