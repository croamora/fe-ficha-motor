import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    const userProfile = this.getUserProfile(); // Obtener el perfil del usuario
    const currentUrl = this.router.url; // Obtener la URL actual

    // Si el perfil ya está determinado (es decir, el login se ha completado)
    if (this.authService.isAuthenticated() && userProfile !== 0) {
      if (currentUrl.includes('/admin') && userProfile === 1) {
        return true; // Ya en la ruta de admin, permite continuar
      } else if (currentUrl.includes('/client') && userProfile === 2) {
        return true; // Ya en la ruta de client, permite continuar
      } else if (currentUrl.includes('/store') && userProfile === 3) {
        return true; // Ya en la ruta de store, permite continuar
      } else {
        // Si no estamos en la ruta correcta, redirigir
        //this.redirectBasedOnProfile(userProfile);
        return true;
      }
    } else {
        // Si no hay perfil, redirigir al login o a una ruta por defecto
        this.router.navigate(['/locales']);
        return false;
    }

    
  }

  private getUserProfile(): number {
    return this.authService.getProfileFromToken() || 0; // Obtener perfil desde el token o almacenamiento
  }

}
