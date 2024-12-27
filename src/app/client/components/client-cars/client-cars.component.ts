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
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-client-cars',
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
  templateUrl: './client-cars.component.html',
  styleUrl: './client-cars.component.scss'
})
export class ClientCarsComponent implements OnInit {

  vehiculos: any[] = [];

  constructor(
    private router: Router,
    private vehiculoService: VehiculoService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit(): void {
    this.callData(); 
  }
  

  public getServerData(event:PageEvent){
    this.callData(event);
  }

  public callData(event?:PageEvent){
    let pageNum = event != null ? (event.pageIndex + 1) : 1;
    let pageSize = event != null ? event.pageSize : 12;
    this.spinner.show();
    this.vehiculoService.getMisVehiculos().subscribe({
      next: (response) => {
        this.spinner.hide();
        this.vehiculos = response;
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los talleres:', err);
      },
    });
  }

  navigateTo(epresaId: number): void {
    //this.router.navigate([`/descubrir/detalle-empresa/${epresaId}`]);
  }


  openFormCar(){
    this.router.navigate(['/client/cars/form']);
  }

}
