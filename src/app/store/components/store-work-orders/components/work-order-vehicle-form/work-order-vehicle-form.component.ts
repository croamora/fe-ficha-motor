import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Observable, startWith, debounceTime, distinctUntilChanged, switchMap, forkJoin, map, of } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { MarcaService } from 'src/app/services/marca.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import Swal from 'sweetalert2';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-work-order-vehicle-form',
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
    MatAutocompleteModule
  ],
  templateUrl: './work-order-vehicle-form.component.html',
  styleUrl: './work-order-vehicle-form.component.scss'
})
export class WorkOrderVehicleFormComponent  implements OnInit {

  @Input() vehicle!: any;
  @Output() formValidChange = new EventEmitter<boolean>(); 
  isFormValid: boolean = false; 


  carForm!: FormGroup;
  marcasFiltradas!: Observable<any[]>;
  modelosFiltrados!: Observable<any[]>;
  tipoVehiculoFiltrados!: Observable<any[]>;
  tipoCombustibleFiltrados!: Observable<any[]>;
  modelos: any[] = [];
  combustibleTypeList: any[] = [];
  vehicleTypeList: any[] = [];
  carExists: boolean = true;
  currentYear: number = new Date().getFullYear();
  patentePreview: string = '';
  selectedMarca: any;
  selectedModelo: any;
  selectedCombustibleType: any;
  selectedVehicleType: any;

  constructor(
    private router : Router,
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private marcaService: MarcaService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private dataService: DataService,
  ) {}

  ngOnInit(): void {

    this.loadData();
    this.currentYear = this.currentYear + 1;
    if(this.vehicle.id){
      //this.carForm.get('patente')?.disable({ emitEvent: false });
      this.carExists = false;
      this.selectedCombustibleType = this.vehicle.tipo_combustible;
      this.selectedVehicleType = this.vehicle.tipo_vehiculo;
      this.selectedMarca=this.vehicle.marca;
      this.onMarcaChange(this.selectedMarca);
      this.selectedModelo=this.vehicle.modelo;
      this.carForm = this.fb.group({
        patente: [
          this.vehicle?.patente || '', 
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,6}$/)]
        ],
        marca: [
          this.vehicle?.marca || null, // Marca debe ser un objeto o null
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
        modelo: [
          this.vehicle?.modelo || null, // Modelo debe ser un objeto o null
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
        anio: [
          this.vehicle?.anio || '', 
          [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]
        ],
        tipoVehiculo: [
          this.vehicle?.tipo_vehiculo || null, // TipoVehiculo debe ser un objeto o null
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
        tipoCombustible: [
          this.vehicle?.tipo_combustible || null, // TipoCombustible debe ser un objeto o null
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
      });
    } else {
      this.carForm = this.fb.group({
        patente: [
          '', 
          [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,6}$/)]
        ],
        marca: [
         null,
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
        modelo: [
          null, 
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
        anio: [
          '', 
          [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]
        ],
        tipoVehiculo: [
          null, 
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
        tipoCombustible: [
          null, 
          { validators: [autocompleteObjectValidator(), Validators.required] }
        ],
      });
    }
   

    this.carForm.get('patente')!.valueChanges.subscribe((value: string) => {
      if (value) {
        this.carForm.get('patente')!.setValue(value.toUpperCase(), { emitEvent: false });
      }
    });

    // Inicializar observables para autocomplete
    this.marcasFiltradas = this.carForm.get('marca')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.filterMarcas(value || ''))
    );

    this.modelosFiltrados = this.carForm.get('modelo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.filterModelos(value || ''))
    );

    this.tipoVehiculoFiltrados= this.carForm.get('tipoVehiculo')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.filterVehicleTipo(value || ''))
    );

    this.tipoCombustibleFiltrados= this.carForm.get('tipoCombustible')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => this.filterCombustibleTipo(value || ''))
    );

  }


  loadData() {
    forkJoin({
      combustibleTypes: this.dataService.getAllCombustibleType(),
      vehicleTypes: this.dataService.getAllVehicleType()
    }).subscribe({
      next: (response) => {
        this.combustibleTypeList = response.combustibleTypes;
        this.vehicleTypeList = response.vehicleTypes;
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      },
    });
  }


  checkPatente(): void {
    const patente = this.carForm.get('patente')?.value;
    this.spinner.show();
    this.vehiculoService.checkVehicle(patente).subscribe({
      next: (exists) => {
        this.carExists = exists;
        this.spinner.hide();
        if (exists) {         
          this.getVehiculoByPatente(patente);
          this.carForm.get('marca')?.disable();
          this.carForm.get('modelo')?.disable();
          this.carForm.get('anio')?.disable();
        } else {
          this.carForm.get('marca')?.enable();
          this.carForm.get('modelo')?.enable();
          this.carForm.get('anio')?.enable();
        }
        this.carForm.get('patente')?.disable({ emitEvent: false });
      },
      error: (err) => { 
        console.error(err)
      },
    });
  }

  getVehiculoByPatente(patente : string) : void{
    this.vehiculoService.getVehiculoByPatente(patente).subscribe({
      next: (vehiculo) => {
        if(vehiculo.asignado){
          Swal.fire({
            icon: "warning",
            title: "Oops...",
            text: "El Vehículo ya existe asignado a otra persona!",
            html: `
                    El Vehículo ya existe asignado a otra persona!, si el vehículo le pertenece puede solicitar que se le transfiera a sus vehículos
                  `,
            showCancelButton: true,
            confirmButtonText: "Solicitar Transferencia",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Saved!", "", "success");
            } 
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "Oops...",
            text: "El Vehículo ya existe!",
            html: `
                    El Vehículo ya existe, si el vehículo le pertenece puede asignarlo a sus vehículos
                  `,
            showCancelButton: true,
            confirmButtonText: "Asignarmelo",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire("Saved!", "", "success");
            } 
          });
        }
      },
      error: (err) => { 
        console.error(err)
      },
    });
  }

  onPatenteInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value.toUpperCase(); // Convierte el valor a mayúsculas
    this.patentePreview = value
  }

  // Filtrar marcas al escribir
  private filterMarcas(query: string): Observable<any[]> {
    return this.marcaService.getMarcas().pipe(
      map((marcas) =>
        marcas.filter((marca) =>
          marca.marca.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  // Manejar entrada de texto en el campo Marca
  onMarcaInput(event: Event): void {
    //this.marcasFiltradas = this.filterMarcas(value);
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.marcasFiltradas = this.filterMarcas(input.value);
    }
  }

  onTipoVehiculoInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      input.focus();
      this.tipoVehiculoFiltrados = this.filterVehicleTipo(input.value);
    }
  }

  onTipoCombustibleInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      input.focus();
      this.tipoCombustibleFiltrados = this.filterCombustibleTipo(input.value);
    }
  }

  // Filtrar modelos al escribir
  private filterModelos(query: string): Observable<any[]> {
    if (!query.trim()) {
      return of(this.modelos); // Si 'query' está vacío o tiene solo espacios, devuelve todos los modelos
    }
    return of(this.modelos).pipe(
      map((modelos) =>
        modelos.filter((modelo) =>
          modelo.modelo.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  private filterVehicleTipo(query: string): Observable<any[]> {
    if (!query.trim()) {
      return of(this.vehicleTypeList);
    }
    return of(this.vehicleTypeList).pipe(
      map((vehicleType) =>
        vehicleType.filter((type) =>
          type.vehicleTypeName.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  private filterCombustibleTipo(query: string): Observable<any[]> {
    if (!query.trim()) {
      return of(this.combustibleTypeList);
    }
    return of(this.combustibleTypeList).pipe(
      map((combustibleType) =>
        combustibleType.filter((type) =>
          type.combustibleName.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }

  onModeloInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.modelosFiltrados = this.filterModelos(input.value);
    }
  }

  onModeloChange(modelo: any) {
    this.selectedModelo = modelo;
  }

  onTipoVehiculoChange(vehicleType : any){
    this.selectedVehicleType = vehicleType;
  }

  onTipoCombustibleChange(combustibleType : any){
    this.selectedCombustibleType = combustibleType;
  }

  // Manejar selección de marca para cargar modelos
  onMarcaChange(marca: any): void {
    this.selectedMarca = marca;
    this.marcaService.getModelosByMarca(marca.id).subscribe({
      next: (modelos) => {
        this.modelos = modelos; 
        this.modelosFiltrados = this.filterModelos("");
      },
      error: (err) => { 
         console.error(err)
      }
    });
  }


  checkFormValidity(): void {
    // Aquí implementa tu lógica para verificar el formulario
    this.isFormValid = this.vehicle?.someRequiredProperty !== undefined; // Ejemplo de validación

    // Emitimos el estado del formulario al padre
    this.formValidChange.emit(this.isFormValid);
  }

  onSubmit(): void {
    // if (this.carForm.valid) {
    //   const rawVehiculo = this.carForm.getRawValue();

    //   const newVehiculo = {
    //     ...rawVehiculo, // Copia el resto de las propiedades
    //     tipo_vehiculo: rawVehiculo.tipoVehiculo, // Renombra tipoVehiculo a tipo_vehiculo
    //     tipo_combustible: rawVehiculo.tipoCombustible, // Renombra tipoCombustible a tipo_combustible
    //   };

    //   // Elimina las propiedades originales si no las necesitas
    //   delete newVehiculo.tipoVehiculo;
    //   delete newVehiculo.tipoCombustible;

    //   this.spinner.show();
    //   this.vehiculoService.save(newVehiculo).subscribe({
    //     next: (result) => {
    //       this.spinner.hide();
    //       this.snackBar.open(result.msg, 'Cerrar', { duration: 3000 });
    //     },
    //     error: (err) => { 
    //       console.error('Error al Crear el vehiculo:', err);
    //       this.spinner.hide();
    //       this.snackBar.open('Error al crear el vehiculo.', 'Cerrar', { duration: 3000 });
    //     }
    //   });
    // }
  }

}

