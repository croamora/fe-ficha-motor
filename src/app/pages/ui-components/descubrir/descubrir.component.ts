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


interface productcards {
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
    MatPaginator
  ],
  templateUrl: './descubrir.component.html',
  styleUrl: './descubrir.component.scss'
})
export class DescubrirComponent implements OnInit {

  pageIndex:number;
  length:number;
  palabraClave: string;
  talleres: any[] = [];
  lat : number;
  lng : number;
  radio : number = 5;
  hasUbicacion:boolean = false;



  constructor(
    private router: Router,
    private tallerService: TallerService,
    private spinner: NgxSpinnerService,
    private authService : AuthService
  ) { }


  ngOnInit(): void {
    this.palabraClave = "";
    this.checkGeolocationPermission();
   
  }
  

  checkGeolocationPermission(): void {
    if (!navigator.permissions || !navigator.geolocation) {
      console.error("Geolocalización no soportada en este navegador");
      this.hasUbicacion = false;
      return;
    }
  
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        // Permiso otorgado
        this.getUbicacion();
      } else if (result.state === 'prompt') {
        // Pendiente de solicitar al usuario
        this.requestUbicacion();
      } else {
        // Permiso denegado
        console.warn("Permiso de geolocalización denegado");
        this.hasUbicacion = false;
      }
    }).catch((error) => {
      console.error("Error al consultar permisos de geolocalización:", error);
      this.hasUbicacion = false;
    });
  }


  getUbicacion(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.radio = 30; 
        this.hasUbicacion = true;
        this.callData(); 
      },
      (error) => {
        console.error("Error al obtener la ubicación:", error);
        this.hasUbicacion = false;
      }
    );
  }
  
  requestUbicacion(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.radio = 30; 
        this.hasUbicacion = true;
        this.callData(); 
      },
      (error) => {
        console.error("Error al obtener la ubicación o permiso denegado:", error);
        this.hasUbicacion = false;
      }
    );
  }


  public getServerData(event:PageEvent){
    this.callData(event);
  }

  public callData(event?:PageEvent){
    if(this.hasUbicacion){
      let pageNum = event != null ? (event.pageIndex + 1) : 1;
      let pageSize = event != null ? event.pageSize : 12;
      this.spinner.show();
      this.tallerService.getTalleresPorGeo(pageNum, pageSize, this.palabraClave, this.lat , this.lng , this.radio).subscribe({
        next: (response) => {
          this.spinner.hide();
          this.pageIndex = (response.pageNum - 1);
          this.length = response.total;
          this.talleres = response.list;
        },
        error: (err) => {
          this.spinner.hide();
          console.error('Error al cargar los talleres:', err);
        },
      });
    }
    
  }

  navigateTo(epresaId: number): void {
    this.router.navigate([`/locales/detalle-empresa/${epresaId}`]);
  }


  iraMisVehiculos(){
    this.router.navigate([`/client/cars`]);
  }

  isUserClient(){
    return this.authService.isAuthenticated() 
              && this.authService.getProfileFromToken() === 2;
  }
}
