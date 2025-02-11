import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, viewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CategoriaService } from 'src/app/services/categoria.service';
import { RegionService } from 'src/app/services/region.service';
import { TallerService } from 'src/app/services/taller.service';
import { UserService } from 'src/app/services/user.service';
import { WorkOrderVehicleFormComponent } from '../work-order-vehicle-form/work-order-vehicle-form.component';
import { Vehicle } from 'src/app/models/vehicle-model';
import { WorkOrderClientFormComponent } from '../work-order-client-form/work-order-client-form.component';
import { User } from 'src/app/models/user-model';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import { WorkOrderServicesFormComponent } from '../work-order-services-form/work-order-services-form.component';

@Component({
  selector: 'app-work-order-form',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatExpansionModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    MatStepperModule,
    MatTableModule,
    MatPaginator,
    MatIconModule,
    TablerIconsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    FormsModule,
    WorkOrderVehicleFormComponent,
    WorkOrderClientFormComponent,
    WorkOrderServicesFormComponent,
  ],
  templateUrl: './work-order-form.component.html',
  styleUrl: './work-order-form.component.scss'
})
export class WorkOrderFormComponent implements OnInit {



  order : any = {}
  accordion = viewChild.required(MatAccordion);
  panel1Open : boolean = true;
  panel2Open : boolean = false;
  panel3Open : boolean = false;
  panel1Disabled : boolean = false;
  panel2Disabled : boolean = true;
  panel3Disabled : boolean = true;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private regionService: RegionService,
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef,
    private vehiculoService: VehiculoService,
    private userService: UserService
  ) {}


  ngOnInit(): void {

    // // Verificar si se está editando
    const orderId = this.route.snapshot.paramMap.get('id') || '';
    
    this.isEditMode = !!orderId;
    if (this.isEditMode) {
      this.order.vehicle = {
        "id": 21,
        "patente": "JJJJJJ",
        "modelo": {
          "id": 1490,
          "idMarca": 104,
          "modelo": "JS2"
        },
        "marca": {
          "id": 104,
          "marca": "JAC"
        },
        "anio": 2023,
        "tipoCombustible": {
          "id": 1,
          "combustibleName": "Bencina"
        },
        "tipoVehiculo": {
          "id": 4,
          "vehicleTypeName": "SUV"
        },
        "insert_date": "2025-01-18T17:48:42.315+00:00",
        "update_date": "2025-01-18T17:48:42.315+00:00"
      };
      this.order.client = {
        "id": 21,
      }
      this.order.services = [
      ]
    } else {
        this.order.vehicle = new Vehicle();
        this.order.client = new User();
        this.order.services = [];
    }

    this.checkPanels()
  }


  onVehicleChange(updatedVehicle: any): void {
    this.order.vehicle = updatedVehicle;
    this.loadClient();
    console.log('vehiculo ',  this.order.vehicle);
    this.checkPanels()
  }

  loadClient(){
    if (this.order.vehicle.id) {
      this.spinner.show();
      this.vehiculoService.getClientByIdVehicle(this.order.vehicle.id).subscribe({
        next: (data) => {
          console.log(data)
          if(data){
            this.order.client = data;
            this.cdr.detectChanges();
            this.checkPanels()
          }
          this.spinner.hide();
        },
        error: (err) => { 
          this.spinner.hide();
          console.error(err)
        },
      });
    }
  }

  onClientChange(client: any): void {
    this.order.client = client;
    this.checkPanels()
  }


  onServiceChange(services: any): void {
    console.log(services)
    this.order.services = services;

  }

  checkPanels(){
    if (this.order.vehicle.id && !this.order.client.id) {
      this.panel1Open = false;
      this.panel2Disabled = false;
      this.panel2Open = true;
    } else if(this.order.client.id) {
      this.panel1Open = false;
      this.panel2Disabled = false;
      this.panel2Open = false;
      this.panel3Disabled = false;
      this.panel3Open = false;
    }
  }

  volver(): void {
    this.router.navigate(['/store/orders']);
  }
}
