import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; 
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/client/connexion']);
      return false;
    }

    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('access_token');
        this.router.navigate(['/client/connexion']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur token:', error);
      localStorage.removeItem('access_token');
      this.router.navigate(['/client/connexion']);
      return false;
    }
  }
}
