import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      this.router.navigate(['/client/connexion']);
      return false;
    }
    
    try {
      // Décoder le token JWT (format: header.payload.signature)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Format de token invalide');
      }
      
      // Décoder la partie payload (deuxième partie du token)
      const payload = JSON.parse(atob(tokenParts[1]));
      const userRole = payload.role;
      
      if (userRole === expectedRole) {
        return true;
      } else {
        // Rediriger selon le rôle
        if (userRole === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/client/dashboard']);
        }
        return false;
      }
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      localStorage.removeItem('access_token'); // Supprimer le token invalide
      this.router.navigate(['/client/connexion']);
      return false;
    }
  }
}