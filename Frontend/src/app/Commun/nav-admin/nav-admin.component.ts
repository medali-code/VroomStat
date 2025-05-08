import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-nav-admin',
  standalone: true,  
  templateUrl: './nav-admin.component.html',
  styleUrls: ['./nav-admin.component.css'],
  imports: [RouterModule] 
})
export class NavAdminComponent {
  constructor(private router: Router) {}

 
  logout() {
    // Logique de déconnexion
    localStorage.removeItem('userToken');  
    sessionStorage.removeItem('userToken'); 

    this.router.navigate(['/home']);  
  }
}
