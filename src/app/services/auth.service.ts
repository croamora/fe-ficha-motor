import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { Router } from '@angular/router';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly TOKEN_KEY = 'authToken';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
  ) {}


  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(environment.apiEndpoint + 'auth/login', { username, password });
  }

  saveClientUser(newUser: any) : Observable<any>{
    return this.http.post<any>(environment.apiEndpoint + 'auth/createClientUser', newUser);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
  
    if (!token) {
      return false; // Si no hay token, no está autenticado
    }
  
    try {
      const decodedToken: any = jwtDecode(token); // Decodifica el token
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return decodedToken.exp > currentTime; // Verifica que el token no haya expirado
    } catch (error) {
      console.error('Error decoding token:', error);
      return false; // Si ocurre un error al decodificar, consideramos que no está autenticado
    }
  }

   // Método para renovar el token
   refreshToken(): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(environment.apiEndpoint + 'auth/refresh', {});
  }

  logout() {
    // Eliminar el token de localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    this.storageService.removeAll();
    this.router.navigate(['/authentication/login']);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }


  getUserIdFromToken(): number | null {
    const token = localStorage.getItem(this.TOKEN_KEY); // Asegúrate de que el token esté almacenado
    if (!token) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token); // Decodifica el token
      return decodedToken?.id || null; // Devuelve el ID del usuario
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getProfileFromToken(): number | null {
    const token = localStorage.getItem(this.TOKEN_KEY); // Asegúrate de que el token esté almacenado
    if (!token || !this.isAuthenticated()) {
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token); 
      return decodedToken?.profileId || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
}
