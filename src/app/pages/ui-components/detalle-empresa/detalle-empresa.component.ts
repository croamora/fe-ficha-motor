import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TallerService } from 'src/app/services/taller.service';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-detalle-empresa',
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
  ],
  templateUrl: './detalle-empresa.component.html',
  styleUrls: ['./detalle-empresa.component.scss'],
})
export class DetalleEmpresaComponent implements OnInit {
  idTaller: string = '';
  taller: any;
  map!: google.maps.Map;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private tallerService: TallerService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.idTaller = params.get('id') || '';
      if (this.idTaller) {
        this.getTallerDetail(this.idTaller);
      }
    });
  }

  getTallerDetail(idTaller: string): void {
    this.spinner.show();
    this.tallerService.getTalleresById(this.idTaller).subscribe({
      next: (data) => {
        this.taller = data;
        this.loadMap(); // Cargar el mapa una vez que se obtienen los datos del taller
        this.spinner.hide();
      },
      error: (err) => {
        console.error('Error al obtener datos del taller:', err);
        this.spinner.hide();
      },
    });
  }

  loadMap(): void {
    const loader = new Loader({
      apiKey: 'AIzaSyABGyRzLv-nzA6DeF4hJSjUAgbULZYPiiU', // Reemplaza con tu clave de API
      version: 'weekly',
      libraries: ['marker'], // Incluye librerías necesarias
    });

    loader.load().then(() => {
      const mapDiv = document.getElementById('map');
      if (!mapDiv) {
        console.error('Contenedor de mapa no encontrado.');
        return;
      }

      this.map = new google.maps.Map(mapDiv, {
        center: { lat: 0, lng: 0 }, // Coordenadas por defecto
        zoom: 15,
        mapId: 'TU_MAP_ID', // Reemplaza con tu Map ID
      });

      // Geocodificar la dirección del taller
      this.geocodeAddress(this.taller.direccion);
    });
  }

  geocodeAddress(address: string): void {
    const geocoder = new google.maps.Geocoder();
    const normalizedAddress = this.normalizeAddress(address);

    geocoder.geocode({ address: normalizedAddress }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const location = results[0].geometry.location;
        this.map.setCenter(location);

        // Agregar marcador avanzado
        new google.maps.marker.AdvancedMarkerElement({
          map: this.map,
          position: location,
          title: this.taller.title || 'Ubicación del taller',
        });
      } else {
        console.error('Geocoding fallido:', status);
      }
    });
  }

  normalizeAddress(address: string): string {
    return address.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Elimina tildes y caracteres especiales
  }



  openGoogleMaps(): void {
    const address = encodeURIComponent(this.taller.direccion);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
    window.open(url, '_blank'); // Abrir en una nueva pestaña
  }

  openWhatsApp(): void {
    const phone = 569 + this.taller.telefono.replace(/[^0-9]/g, ''); // Limpia el número
    const message = encodeURIComponent('Hola, quiero conocer más de sus servicios.');
    const url = `https://api.whatsapp.com/send/?phone=${phone}&text=${message}&type=phone_number&app_absent=0`;
    window.open(url, '_blank'); // Abrir en una nueva pestaña
  }

}
