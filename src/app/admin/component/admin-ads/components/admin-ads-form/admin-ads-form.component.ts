import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AdsService } from 'src/app/services/ads.service';
import { TallerService } from 'src/app/services/taller.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-ads-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTableModule,
    MatPaginator,
    MatCheckboxModule,
    MatIconModule,
    TablerIconsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatDividerModule,
    FormsModule
  ],
  templateUrl: './admin-ads-form.component.html',
  styleUrl: './admin-ads-form.component.scss'
})
export class AdminAdsFormComponent implements OnInit {

  adsForm: FormGroup;
  talleresSeleccionados: any[] = [];
  isEditMode = false;
  imagen: string | ArrayBuffer | null = null;
  adsOriginal: any;

  displayedColumns: string[] = ['select', 'img', 'nombre'];
  tiendas: MatTableDataSource<any>;
  palabraClave: string = '';
  pageIndex: number;
  length: number;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private adsService: AdsService,
    private tallerService: TallerService,
  ) {}

  ngOnInit(): void {

    // Verificar si se está editando
    const adsId = this.route.snapshot.paramMap.get('id') || '';
    this.callData();
    this.isEditMode = !!adsId;

    // Inicializar formularios
    this.adsForm = this.fb.group({
      img: [null, Validators.required],
      url: [''],
      selectedTiendas: this.fb.array([]),
    });

    

    if (this.isEditMode) {
      this.adsService.getAdsById(adsId).subscribe({
        next: (adsData: any) => {
          this.adsOriginal = adsData;          
          this.adsForm.patchValue({
            img: null,
            url: adsData.imagenPublicidad.link,
          });

          const tiendasArray = this.adsForm.get('selectedTiendas') as FormArray;
          tiendasArray.clear();
          adsData.idsTalleres.forEach((idTaller) => {
            tiendasArray.push(this.fb.control(idTaller)); 
          });

          this.adsForm.get('img')?.clearValidators();
          this.adsForm.updateValueAndValidity()
          this.imagen = adsData.imagenPublicidad.img;
          this.adsForm.get('img')?.clearValidators();
          this.adsForm.get('img')?.updateValueAndValidity();

        },
        error: (err) => {
          console.error('Error al cargar los datos del ADS:', err);
        },
      });
    }

    
    
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
          this.imagen = reader.result;
        }
      };
      reader.readAsDataURL(file);
  
      this.adsForm.patchValue({
        [controlName]: file,
      });
  
      this.adsForm.get(controlName)?.markAsTouched();
      this.adsForm.get(controlName)?.updateValueAndValidity();
    } else if (this.isEditMode) {
      // Si es edición y no se selecciona un nuevo archivo, usar la URL existente
      if (controlName === 'img') {
        this.adsForm.patchValue({ img: this.imagen });
      }
    }
  }

  get selectedTiendas() {
    return (this.adsForm.get('selectedTiendas') as FormArray);
  }

  isTiendaSelected(tienda: any): boolean {
    const tiendaArray = this.adsForm.get('selectedTiendas') as FormArray;
    return tiendaArray.controls.some((control) => {
      return control.value  === tienda.id;
    });
  }


  
  toggleTiendaSelection(tienda: any, isChecked: boolean): void {
    const tiendaArray = this.adsForm.get('selectedTiendas') as FormArray;
    if (isChecked) {
      tiendaArray.push(this.fb.control(tienda.id));
    } else {
      const index = tiendaArray.controls.findIndex((control) => control.value.id === tienda.id);
      if (index !== -1) {
        tiendaArray.removeAt(index);
      }
    }
  }

  guardar(): void {
    const adsData = this.adsForm.getRawValue();
    console.log(adsData)
    if (this.adsForm.valid) {
      const adsToSend = new FormData();
      const img = this.adsForm.get('img')?.value;
      if (img) {
        adsToSend.append('img', img);
      }
      const selectedTiendas = adsData.selectedTiendas.map((tienda: any) => tienda);
      console.log(selectedTiendas)
      adsToSend.append('selectedTiendas', JSON.stringify(selectedTiendas));
      adsToSend.append('imagenPublicidad', JSON.stringify({
        id: this.isEditMode ? this.adsOriginal.imagenPublicidad.id : null, 
        idImagenType: this.isEditMode ? this.adsOriginal.imagenPublicidad.idImagenType : 1,
        link: adsData.url
      }));
  
      this.spinner.show();
      if (this.isEditMode) {
        this.adsService.updaAds( this.adsOriginal.imagenPublicidad.id, adsToSend).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
            this.volver();
          },
          error: (err) => {
            console.error('Error al actualizar el ADS:', err);
            this.spinner.hide();
            this.snackBar.open('Error al actualizar el ADS.', 'Cerrar', { duration: 3000 });
          },
        });
      } else {
        this.adsService.createAds(adsToSend).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
            this.volver();
          },
          error: (err) => {
            console.error('Error al actualizar el ADS:', err);
            this.spinner.hide();
            this.snackBar.open('Error al crear el ADS.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    }
  }


  eliminarAds(): void {
    Swal.fire({
      title: "Está seguro?",
      text: "La publicidad será eliminada para siempre!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Borrar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.adsService.deleteAds(this.adsOriginal.imagenPublicidad.id).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
            this.volver();
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al eliminar el ADS:', err);
            this.snackBar.open('Hubo un error al eliminar el ADS.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  public getServerData(event:PageEvent){
    this.callData(event);
  }

  public callData(event?: PageEvent): void {
    const pageNum = event?.pageIndex ? event.pageIndex + 1 : 1;
    const pageSize = event?.pageSize ? event.pageSize : 6;
    this.spinner.show();
    this.tallerService.getTalleres(pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.tiendas = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar las Tiendas:', err);
      },
    });
  }

  volver(): void {
    this.router.navigate(['/admin/ads']);
  }
}
