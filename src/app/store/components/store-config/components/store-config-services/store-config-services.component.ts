import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ServicioService } from 'src/app/services/servicio.service';
import { StorageService } from 'src/app/services/storage.service';
import Swal from 'sweetalert2';
import { ServicioModalComponent } from './modals/servicio-modal.component';
import { PrecioServicio, Servicio } from 'src/app/models/servicio-model';

@Component({
  selector: 'app-store-config-services',
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
    MatIconModule,
    MatTableModule,
    MatDialogModule
  ],
  templateUrl: './store-config-services.component.html',
  styleUrl: './store-config-services.component.scss'
})
export class StoreConfigServicesComponent implements OnInit {

  displayedColumns: string[] = ['categoria', 'servicio', 'precio', 'acciones'];
  servicios: MatTableDataSource<any>;
  pageIndex: number;
  length: number;
  palabraClave: string = '';

  constructor(
    private servicioService: ServicioService,
    private storageService: StorageService, 
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.callData();
  }

  public getServerData(event:PageEvent){
    this.callData(event);
  }

  public callData(event?: PageEvent): void {
    const pageNum = event?.pageIndex ? event.pageIndex + 1 : 1;
    const pageSize = event?.pageSize ? event.pageSize : 12;
    const idTaller = this.storageService.getSelectedStore().id;
    this.spinner.show();
    this.servicioService.getServiciosByTaller(idTaller, pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.servicios = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los Servicios:', err);
      },
    });
  }


  agregarServicio(): void {
    const dialogRef = this.dialog.open(ServicioModalComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
        const idTaller = this.storageService.getSelectedStore().id;
        const newPrecio: PrecioServicio = {
          id:null,
          idServicio:null,
          idTaller:idTaller,
          precio:result.precio
        }
        const newServicio: Servicio = {
          id: null,
          idCategoria: null,
          idTaller: idTaller,
          categoria: null,
          servicio: result.servicio,
          especial: false,
          precio : newPrecio
        };

        this.spinner.show();
        this.servicioService.createServicio(newServicio).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al crear el Servicio:', err);
            this.snackBar.open('Hubo un error al crear el Servicio.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  editarServicio(servicio: any): void {
    const dialogRef = this.dialog.open(ServicioModalComponent, {
      width: '500px',
      data: { servicio }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(servicio)
        const idTaller = this.storageService.getSelectedStore().id;
        const newPrecio: PrecioServicio = {
          id:servicio.precio.id,
          idServicio:servicio.id,
          idTaller:idTaller,
          precio:result.precio
        }
        const newServicio: Servicio = {
          id: servicio.id,
          idCategoria: servicio.idCategoria,
          idTaller: servicio.idTaller,
          categoria: servicio.categoria,
          servicio: result.servicio,
          especial: servicio.especial,
          precio : newPrecio
        };
        this.spinner.show();
        this.servicioService.updateServicio(newServicio).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al actualizar el Servicio:', err);
            this.snackBar.open('Hubo un error al actualizar el Servicio.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  eliminarServicio(id: number): void {
    Swal.fire({
      title: "Está seguro?",
      text: "Se eliminará el servicio!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Borrar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.servicioService.deleteServicio(id).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al eliminar el Servicio:', err);
            this.snackBar.open('Hubo un error al eliminar el Servicio.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }
}
