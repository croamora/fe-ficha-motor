import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { MarcaService } from 'src/app/services/marca.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-client-cars',
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
  templateUrl: './form-client-cars.component.html',
  styleUrls: ['./form-client-cars.component.scss']
})
export class FormClientCarsComponent implements OnInit {
  carForm!: FormGroup;
  marcasFiltradas!: Observable<any[]>;
  modelosFiltrados!: Observable<any[]>;
  modelos: any[] = [];
  combustibleTypeList: any[] = [];
  vehicleTypeList: any[] = [];
  carExists: boolean = true;
  currentYear: number = new Date().getFullYear();
  patentePreview: string = '';
  selectedMarca: any;
  selectedModelo: any;

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
    this.currentYear = this.currentYear + 1;
    // Inicializar formulario
    this.carForm = this.fb.group({
      patente: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,6}$/)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: [
        '',
        [Validators.required, Validators.min(1900), Validators.max(this.currentYear)],
      ],
      tipoVehiculo: ['', Validators.required],
      tipoCombustible: ['', Validators.required],
    });

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

    this.loadData();


  }

  loadData(){
    this.dataService.getAllCombustibleType().subscribe({
      next: (response) => {
        this.combustibleTypeList = response;
      },
      error: (err) => {
        console.error('Error al cargar los tipos de combustible:', err);
      },
    });

    this.dataService.getAllVehicleType().subscribe({
      next: (response) => {
        this.vehicleTypeList = response;
      },
      error: (err) => {
        console.error('Error al cargar los tipos de vehículo:', err);
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

  onModeloInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input) {
      this.modelosFiltrados = this.filterModelos(input.value);
    }
  }


  onModeloChange(modelo: any) {
    this.selectedModelo = modelo;
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

  onSubmit(): void {
    if (this.carForm.valid) {
      const rawVehiculo = this.carForm.getRawValue();

      const newVehiculo = {
        ...rawVehiculo, // Copia el resto de las propiedades
        tipo_vehiculo: rawVehiculo.tipoVehiculo, // Renombra tipoVehiculo a tipo_vehiculo
        tipo_combustible: rawVehiculo.tipoCombustible, // Renombra tipoCombustible a tipo_combustible
      };

      // Elimina las propiedades originales si no las necesitas
      delete newVehiculo.tipoVehiculo;
      delete newVehiculo.tipoCombustible;
      
      this.spinner.show();
      this.vehiculoService.save(newVehiculo).subscribe({
        next: (result) => {
          this.spinner.hide();
          this.snackBar.open(result.msg, 'Cerrar', { duration: 3000 });
          this.volver();
        },
        error: (err) => { 
          console.error('Error al Crear el vehiculo:', err);
          this.spinner.hide();
          this.snackBar.open('Error al crear el vehiculo.', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/client/cars']);
  }
}
