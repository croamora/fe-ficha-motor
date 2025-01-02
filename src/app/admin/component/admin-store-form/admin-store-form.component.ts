import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Categoria } from 'src/app/models/categoria-model';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RegionService } from 'src/app/services/region.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-admin-store-form',
  standalone: true,
  imports: [
    DragDropModule,
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
    FormsModule
  ],
  templateUrl: './admin-store-form.component.html',
  styleUrls: ['./admin-store-form.component.scss']
})
export class AdminStoreFormComponent implements OnInit {
  tallerForm: FormGroup;
  usuarioForm: FormGroup;
  categoriasDisponibles: Categoria[] = [];
  categoriasSeleccionadas: Categoria[] = [];

  regiones: any[] = [];
  comunas: any[] = [];
  comunasFiltradas: any[] = [];
  usuarios: any[] = [];
  selectedUsuario: string | null = null;
  isEditMode = false;

  displayedColumns: string[] = ['select', 'usuario', 'email', 'telefono'];

  imagenPrincipal: string | ArrayBuffer | null = null;
  imagenPerfil: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private regionService: RegionService,
    private categoriaService: CategoriaService,
  ) {}

  ngOnInit(): void {
    // Verificar si se está editando
    const tallerId = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
    this.isEditMode = !!tallerId;

    // Inicializar formularios
    this.tallerForm = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[0-9]{8}$/), // Valida exactamente 8 dígitos
      ]),
      img: [null, Validators.required],
      imgProfile: [null, Validators.required],
      descripcion: [''],
      idRegion: [null, Validators.required],
      idComuna: [null, Validators.required],
    });

    this.usuarioForm = this.fb.group({
      selectedUsuario: ['', Validators.required], // Control de usuario seleccionado
    });

    // Si es edición, cargar datos del taller
    if (this.isEditMode) {
      this.cargarTaller(tallerId);
    }
  }

  cargarTaller(id: string): void {
    // Aquí iría la lógica para obtener los datos del taller por ID y rellenar los formularios
    console.log('Cargar datos del taller con ID:', id);
  }

  loadData(): void {
    this.regionService.getRegiones().subscribe(
      (regionesResult) => {
        this.regiones = regionesResult;
      },
      (error) => console.error(error)
    );

    this.categoriaService.getCategorias().subscribe(
      (categoriaResult) => {
        this.categoriasDisponibles = categoriaResult;
      },
      (error) => console.error(error)
    );

    this.usuarios = [
      { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com', telefono: 56912345678 },
      { id: 2, name: 'Ana Gómez', email: 'ana.gomez@example.com', telefono: 56912345678 },
      { id: 3, name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', telefono: 56912345678 }
    ];
    
  }

  onRegionChange(): void {
    const regionId = this.tallerForm.get('idRegion')?.value;
    this.regionService.getComunasByRegion(regionId).subscribe(
      (comunasResult) => {
        this.comunasFiltradas = comunasResult;
      },
      (error) => {
        this.comunas = [];
        console.error(error)
      });
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Validar que el archivo sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        input.value = ''; // Limpiar el campo de archivo
        return;
      }
  
      // Previsualización de la imagen (opcional)
      const reader = new FileReader();
      reader.onload = () => {
        if (controlName === 'img') {
          this.imagenPrincipal = reader.result; // Para previsualización
        } else if (controlName === 'imgProfile') {
          this.imagenPerfil = reader.result; // Para previsualización
        }
      };
      reader.readAsDataURL(file);
  
      // Actualizar el formulario
      this.tallerForm.patchValue({
        [controlName]: file,
      });
  
      // Marcar el control como tocado y actualizar su estado
      this.tallerForm.get(controlName)?.markAsTouched();
      this.tallerForm.get(controlName)?.updateValueAndValidity();
    }
  }
  

  drop(event: CdkDragDrop<Categoria[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  

  volver(): void {
    this.router.navigate(['/admin/stores']);
  }

  guardar(stepper: any): void {
    if (this.tallerForm.valid && this.usuarioForm.valid) {
      const tallerData = this.tallerForm.value;
      const usuarioData = this.usuarioForm.value;
      console.log('Datos del Taller:', tallerData);
      console.log('Datos del Usuario:', usuarioData);

      // Aquí iría la lógica para guardar el taller (crear o editar)
      stepper.next();
    }
  }

  selectUsuario(id: string): void {
    // Actualiza el valor seleccionado cuando se hace clic en la fila
    this.usuarioForm.patchValue({
      selectedUsuario: id,
    });
  }
}
