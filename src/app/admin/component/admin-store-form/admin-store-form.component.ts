import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { RegionService } from 'src/app/services/region.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MatRadioModule } from '@angular/material/radio';
import { TallerService } from 'src/app/services/taller.service';
import { UserService } from 'src/app/services/user.service';
import { ClientUser } from 'src/app/models/clientUser-model';
import { UserModel } from 'src/app/models/user-model';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isEditMode = false;

  displayedColumns: string[] = ['select', 'name', 'usuario', 'email', 'telefono'];

  imagenPrincipal: string | ArrayBuffer | null = null;
  imagenPerfil: string | ArrayBuffer | null = null;
  tallerOriginal: any;

  usuarios: MatTableDataSource<UserModel>;
  palabraClave: string = '';
  pageIndex: number;
  length: number;

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

    // Verificar si se está editando
    const tallerId = this.route.snapshot.paramMap.get('id') || '';
    
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
      selectedUsuarios: this.fb.array([]),
    });

    this.loadData();

    // Si es edición, cargar datos del taller
    if (this.isEditMode) {
      this.cargarTaller(tallerId);
      this.tallerForm.get('img')?.clearValidators();
      this.tallerForm.get('imgProfile')?.clearValidators();
      this.tallerForm.updateValueAndValidity();
    } 
  }

  cargarTaller(id: string): void {
    // Aquí llamarías al servicio que obtiene los datos del taller por ID.
    this.tallerService.getTallerToEditById(id).subscribe({
      next: (tallerData: any) => {
        // Cargar datos principales del taller
        this.tallerOriginal = tallerData.taller;
        this.tallerForm.patchValue({
          nombre: tallerData.taller.nombre,
          direccion: tallerData.taller.direccion,
          telefono: tallerData.taller.telefono,
          img: null, // No puedes asignar archivos directamente, manejarás esto con la vista.
          imgProfile: null,
          descripcion: tallerData.taller.descripcion,
          idRegion: tallerData.taller.region.id,
          idComuna: tallerData.taller.comuna.id,
        });
  
        // Cargar imágenes (previsualización opcional)
        this.imagenPrincipal = tallerData.taller.img;
        this.imagenPerfil = tallerData.taller.imgProfile;
  
        // Filtrar comunas al cargar
        this.onRegionChange();
  
        // Si tiene categorías seleccionadas
        if (tallerData.categorias) {
          this.categoriasSeleccionadas = tallerData.categorias;
          this.categoriasDisponibles = this.categoriasDisponibles.filter(
            (cat) => !tallerData.categorias.some((sel: Categoria) => sel.id === cat.id)
          );
        }
  
        // // Si tiene usuarios asignados
        if (tallerData.usuarios) {
          const usuariosArray = this.usuarioForm.get('selectedUsuarios') as FormArray;
          // Limpiar el array si estás cargando los usuarios en una edición
          usuariosArray.clear();

          // Agregar los usuarios al FormArray
          tallerData.usuarios.forEach((usuario) => {
            usuariosArray.push(this.fb.group(usuario));  // Aquí, 'usuario' contiene los datos del usuario
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos del taller:', err);
      },
    });
  }

  loadData(): void {
    this.regionService.getRegiones().subscribe({
      next: (regionesResult) => {
        this.regiones = regionesResult;
      },
      error: (err) => { 
        console.error(err)
      }
    });

    this.categoriaService.getCategorias().subscribe({
      next: (categoriaResult) => {
        this.categoriasDisponibles = categoriaResult;
      },
      error: (err) => {
        console.error(err)
      }
    });


    this.callData();
    
  }

  onRegionChange(): void {
    const regionId = this.tallerForm.get('idRegion')?.value;
    this.regionService.getComunasByRegion(regionId).subscribe({
      next: (comunasResult) => { 
        this.comunasFiltradas = comunasResult;
      },
      error: (err) => {
        this.comunas = [];
        console.error(err)
      }
    });
  }

  onFileChange(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecciona un archivo de imagen válido.');
        input.value = ''; // Limpiar el campo de archivo
        return;
      }
  
      const reader = new FileReader();
      reader.onload = () => {
        if (controlName === 'img') {
          this.imagenPrincipal = reader.result;
        } else if (controlName === 'imgProfile') {
          this.imagenPerfil = reader.result;
        }
      };
      reader.readAsDataURL(file);
  
      this.tallerForm.patchValue({
        [controlName]: file,
      });
  
      this.tallerForm.get(controlName)?.markAsTouched();
      this.tallerForm.get(controlName)?.updateValueAndValidity();
    } else if (this.isEditMode) {
      // Si es edición y no se selecciona un nuevo archivo, usar la URL existente
      if (controlName === 'img') {
        this.tallerForm.patchValue({ img: this.imagenPrincipal });
      } else if (controlName === 'imgProfile') {
        this.tallerForm.patchValue({ imgProfile: this.imagenPerfil });
      }
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
    if (this.tallerForm.valid) {
      const tallerData = this.tallerForm.value;
      const usuarioData = (this.usuarioForm.value.selectedUsuarios || []).map((usuario: any) => {
        return {
          ...usuario,
          user_name: usuario.userName, 
          userName: undefined,
        };
      });

      const usuariosFinal = usuarioData.length > 0 ? usuarioData : [];
  
      // Crear el objeto que será enviado al backend
      const tallerEditado = new FormData();
  
      // Agregar datos del taller (sin los archivos)
      tallerEditado.append('categorias', JSON.stringify(this.categoriasSeleccionadas)); // Enviamos las categorías como un string JSON
      tallerEditado.append('usuarios', JSON.stringify(usuariosFinal)); // Enviamos los usuarios seleccionados como string JSON
  
      // Agregar los datos del taller (sin las imágenes)
      tallerEditado.append('taller', JSON.stringify({
        id: this.isEditMode ? this.tallerOriginal.id : null, // Si estás editando, usa el id del taller
        nombre: tallerData.nombre,
        direccion: tallerData.direccion,
        telefono: tallerData.telefono,
        descripcion: tallerData.descripcion,
        idComuna: tallerData.idComuna,
      }));
  
      // Comprobación explícita para las imágenes
      const img = this.tallerForm.get('img')?.value;
      const imgProfile = this.tallerForm.get('imgProfile')?.value;
      if (img) {
        tallerEditado.append('img', img);
      }
      if (imgProfile) {
        tallerEditado.append('imgProfile', imgProfile);
      }
  
      // Llamada al servicio para crear o editar el taller
      this.spinner.show();
      if (this.isEditMode) {
        this.tallerService.updateTaller( this.tallerOriginal.id, tallerEditado).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
            this.volver();
          },
          error: (err) => {
            console.error('Error al actualizar el taller:', err);
            this.spinner.hide();
            this.snackBar.open('Error al actualizar el taller.', 'Cerrar', { duration: 3000 });
          },
        });
      } else {
        this.tallerService.createTaller(tallerEditado).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
            this.volver();
          },
          error: (err) => {
            console.error('Error al actualizar el taller:', err);
            this.spinner.hide();
            this.snackBar.open('Error al crear el taller.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  get selectedUsuarios() {
    return (this.usuarioForm.get('selectedUsuarios') as FormArray);
  }
  
  isUsuarioSelected(usuario: any): boolean {
    const usuariosArray = this.usuarioForm.get('selectedUsuarios') as FormArray;
    return usuariosArray.controls.some((control) => control.value.id === usuario.id);
  }


  
  toggleUsuarioSelection(usuario: any, isChecked: boolean): void {
    const usuariosArray = this.usuarioForm.get('selectedUsuarios') as FormArray;
    if (isChecked) {
      usuariosArray.push(this.fb.group(usuario));
    } else {
      const index = usuariosArray.controls.findIndex((control) => control.value.id === usuario.id);
      if (index !== -1) {
        usuariosArray.removeAt(index);
      }
    }
  }


  agregarUsuarioTaller(){

  }

  public getServerData(event:PageEvent){
    this.callData(event);
  }

  public callData(event?: PageEvent): void {
    const pageNum = event?.pageIndex ? event.pageIndex + 1 : 1;
    const pageSize = event?.pageSize ? event.pageSize : 12;
    this.spinner.show();
    this.userService.getUsuariosTalleres(pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.usuarios = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los Modelos:', err);
      },
    });
  }
}