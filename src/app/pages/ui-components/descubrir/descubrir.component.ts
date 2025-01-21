import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { TallerService } from 'src/app/services/taller.service';

interface ProductCard {
  id: number;
  imgSrc: string;
  title: string;
  location: string;
  rprice: string;
}

@Component({
  selector: 'app-descubrir',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    TablerIconsModule,
    NgxSpinnerModule,
    MatPaginator,
  ],
  templateUrl: './descubrir.component.html',
  styleUrl: './descubrir.component.scss',
})
export class DescubrirComponent implements OnInit {
  pageIndex: number = 0;
  length: number = 0;
  palabraClave: string = '';
  talleres: any[] = [];
  lat: number = 0;
  lng: number = 0;
  radio: number = 30; // Radio predeterminado
  hasUbicacion: boolean = false;
  permissionState: 'granted' | 'denied' | 'prompt' | null = null;

  constructor(
    private router: Router,
    private tallerService: TallerService,
    private spinner: NgxSpinnerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeData();
  }

  private initializeData(): void {
    // Cargar los datos inicialmente sin geolocalización
    this.callData(); 
    // Solicitar geolocalización de manera asíncrona
    this.getUbicacionAndLoadData();
  }

  // Obtener la geolocalización y cargar datos cuando esté disponible
  private async getUbicacionAndLoadData(): Promise<void> {
    try {
      const position = await this.getGeolocation(); // Esperar la geolocalización
      this.updateUbicacion(position); // Actualizar ubicación
      this.callData(); // Cargar datos con la nueva ubicación
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  // Obtener geolocalización como promesa
  private getGeolocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
  }

  // Actualizar los datos de ubicación
  private updateUbicacion(position: GeolocationPosition): void {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.hasUbicacion = true;
  }

  // Llamada para obtener los talleres (con o sin ubicación)
  public callData(event?: PageEvent): void {
    const pageNum = event ? event.pageIndex + 1 : 1;
    const pageSize = event ? event.pageSize : 12;

    this.spinner.show();
    this.tallerService
      .getTalleresPorGeo(pageNum, pageSize, this.palabraClave, this.lat, this.lng, this.radio)
      .subscribe({
        next: (response) => {
          this.spinner.hide();
          this.pageIndex = response.pageNum - 1;
          this.length = response.total;
          this.talleres = response.list;
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error al cargar los talleres:', err);
        },
      });
  }

  // Paginación y carga de datos
  public getServerData(event: PageEvent): void {
    this.callData(event);
  }

  // Navegación a detalle de empresa
  navigateTo(empresaId: number): void {
    this.router.navigate([`/locales/detalle-empresa/${empresaId}`]);
  }

  // Navegación a mis vehículos
  iraMisVehiculos(): void {
    this.router.navigate([`/client/cars`]);
  }

  // Validar si el usuario es cliente
  isUserClient(): boolean {
    return (
      this.authService.isAuthenticated() &&
      this.authService.getProfileFromToken() === 2
    );
  }
}
