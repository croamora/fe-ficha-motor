import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { MarcaService } from 'src/app/services/marca.service';
import { AgregarMarcaComponent } from './modals/agregar-marca/agregar-marca.component';
import Swal from 'sweetalert2';
import { Marca } from 'src/app/models/marca-model';

@Component({
  selector: 'app-admin-brands',
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
  templateUrl: './admin-brands.component.html',
  styleUrl: './admin-brands.component.scss'
})
export class AdminBrandsComponent implements OnInit {

  displayedColumns: string[] = ['marca', 'modelos', 'acciones'];
  marcas: MatTableDataSource<any>;
  pageIndex: number;
  length: number;
  palabraClave: string = '';

  constructor(
    private router: Router,
    private marcaService: MarcaService,
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
    this.spinner.show();
    this.marcaService.getPaginMarcas(pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.marcas = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar las Marcas:', err);
      },
    });
  }

  irAModelos(id: number): void {
    this.router.navigate(['/admin/brands/models', id]);
  }

  agregarMarca(): void {
    const dialogRef = this.dialog.open(AgregarMarcaComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();
        this.marcaService.createMarca(result).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al crear la marca:', err);
            this.snackBar.open('Hubo un error al crear la marca.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  editarMarca(marca: any): void {
    const dialogRef = this.dialog.open(AgregarMarcaComponent, {
      width: '400px',
      data: { marca }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.spinner.show();
        this.marcaService.updateMarca(result).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al actualizar la marca:', err);
            this.snackBar.open('Hubo un error al actualizar la marca.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  eliminarMarca(id: number): void {
    Swal.fire({
      title: "Está seguro?",
      text: "Al borrar se eliminarán todos los modelos asociados!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Borrar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.marcaService.deleteMarca(id).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al eliminar la marca:', err);
            this.snackBar.open('Hubo un error al eliminar la marca.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }
}
