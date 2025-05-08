import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; 
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-nav-client',
  standalone: true, 
  templateUrl: './nav-client.component.html',
  styleUrls: ['./nav-client.component.css'],
  imports: [RouterModule] 

})
export class NavClientComponent {
  constructor(private router: Router,private authService:AuthService) {}

 
  logout() {
    this.authService.logout();
    this.router.navigate(['/client/connexion'])

 
  }
}
