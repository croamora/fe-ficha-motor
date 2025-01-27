import { CommonModule } from '@angular/common';
import { Component, OnInit, viewChild } from '@angular/core';
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
  ],
  templateUrl: './work-order-form.component.html',
  styleUrl: './work-order-form.component.scss'
})
export class WorkOrderFormComponent implements OnInit {



  order : any = {}
  accordion = viewChild.required(MatAccordion);
  panel1Open : boolean = true;
  panel2Open : boolean = true;
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
    private tallerService: TallerService,
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
        "tipo_combustible": {
          "id": 1,
          "combustibleName": "Bencina"
        },
        "tipo_vehiculo": {
          "id": 4,
          "vehicleTypeName": "SUV"
        },
        "insert_date": "2025-01-18T17:48:42.315+00:00",
        "update_date": "2025-01-18T17:48:42.315+00:00"
      };
    } else {
        this.order.vehicle = new Vehicle();
    }

    // // Inicializar formularios
    // this.tallerForm = this.fb.group({
    //   nombre: ['', Validators.required],
    //   direccion: ['', Validators.required],
    //   telefono: new FormControl('', [
    //     Validators.required,
    //     Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
    //   ]),
    //   img: [null, Validators.required],
    //   imgProfile: [null, Validators.required],
    //   descripcion: [''],
    //   latitud: ['', Validators.required],
    //   longitud: ['', Validators.required],
    //   idRegion: [null, Validators.required],
    //   idComuna: [null, Validators.required],
    // });

    // this.usuarioForm = this.fb.group({
    //   selectedUsuarios: this.fb.array([]),
    // });

    // this.loadData();

    // // Si es edición, cargar datos del taller
    // if (this.isEditMode) {
    //   this.cargarTaller(tallerId);
    //   this.tallerForm.get('img')?.clearValidators();
    //   this.tallerForm.get('imgProfile')?.clearValidators();
    //   this.tallerForm.updateValueAndValidity();
    // } 
  }


  onFormValidChange(isValid: boolean): void {
    //this.isFormComplete = isValid;

    // Aquí puedes habilitar botones o realizar otras acciones
    console.log('¿Formulario completo?', isValid);
  }


  volver(): void {
    this.router.navigate(['/store/orders']);
  }
}
