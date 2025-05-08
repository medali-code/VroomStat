import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      this.router.navigate(['/client/connexion']);
      return false;
    }
    
    try {
      // Vérifier si le token est expiré
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Vérification de l'expiration
      const currentTime = Math.floor(Date.now() / 1000); // Timestamp actuel en secondes
      if (payload.exp && payload.exp < currentTime) {
        // Token expiré
        localStorage.removeItem('access_token');
        this.router.navigate(['/client/connexion']);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error);
      localStorage.removeItem('access_token');
      this.router.navigate(['/client/connexion']);
      return false;
    }
  }
}