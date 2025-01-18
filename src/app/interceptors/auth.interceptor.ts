import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes(`${environment.apiEndpoint}auth/login`)
      || request.url.includes(`${environment.apiEndpoint}auth/recuperar`)
      || request.url.includes(`${environment.apiEndpoint}auth/codigo`)
      || request.url.includes(`${environment.apiEndpoint}auth/changePassword`)
      || request.url.includes(`${environment.apiEndpoint}images`)
      || request.url === `${environment.apiEndpoint}taller`
      || request.url === `${environment.apiEndpoint}taller/userFilter`
      || request.url.includes(`${environment.apiEndpoint}taller?pageNum=`)
      || request.url.includes(`${environment.apiEndpoint}auth/createClientUser`)
      || new RegExp(`${environment.apiEndpoint}taller/\\d+$`).test(request.url)
    ) {
      return next.handle(request);
    }
    
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.router.navigate(['/authentication/login']);
      return new Observable<HttpEvent<any>>();
    }

    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          // Intentar renovar el token
          return this.authService.refreshToken().pipe(
            switchMap((response) => {
              this.isRefreshing = false;

              // Guardar el nuevo token
              this.authService.saveToken(response.token);

              // Reintentar la solicitud original con el nuevo token
              return next.handle(
                request.clone({
                  setHeaders: { Authorization: `Bearer ${response.token}` },
                })
              );
            }),
            catchError((err) => {
              this.isRefreshing = false;
              console.error('No se pudo renovar el token. Redirigiendo al login...');
              this.router.navigate(['/authentication/login']);
              return throwError(() => err);
            })
          );
        }

        // Otros errores
        return throwError(() => error);
      })
    );
  }
}
