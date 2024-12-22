import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-mapa',
  template: `
    <div id="map" style="height: 300px; width: 100%;"></div>
  `,
})
export class MapaComponent implements OnInit {
  map!: google.maps.Map;

  ngOnInit(): void {
    const loader = new Loader({
      apiKey: 'TU_API_KEY',
      version: 'weekly',
      libraries: ['marker'],
    });

    loader.load().then(() => {
      const mapDiv = document.getElementById('map')!;
      this.map = new google.maps.Map(mapDiv, {
        center: { lat: 37.7749, lng: -122.4194 }, // Reemplaza con las coordenadas deseadas
        zoom: 15,
      });

      const position = { lat: 37.7749, lng: -122.4194 }; // Coordenadas del marcador
      const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        map: this.map,
        position,
        title: 'Ubicación del taller',
      });
    });
  }
}
