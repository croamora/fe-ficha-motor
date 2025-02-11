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
import { ActivatedRoute, Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Marca } from 'src/app/models/marca-model';
import { MarcaService } from 'src/app/services/marca.service';
import { AgregarModeloComponent } from './modals/agregar-modelo/agregar-modelo.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-models',
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
  ],
  templateUrl: './admin-models.component.html',
  styleUrl: './admin-models.component.scss'
})
export class AdminModelsComponent implements OnInit {

  displayedColumns: string[] = ['modelo', 'acciones'];
  modelos: MatTableDataSource<any>;
  pageIndex: number;
  length: number;
  palabraClave: string = '';
  marcaId: string = '';
  marca: Marca;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private marcaService: MarcaService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.marcaId = params.get('id') || '';
      if (this.marcaId) {
        this.getMarca();
        this.callData();
      }
    });
  }

  public getMarca(): void {
    this.marcaService.getMarca(this.marcaId).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.marca = response;
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar la Marcas:', err);
      },
    });
  }

  public getServerData(event:PageEvent){
    this.callData(event);
  }

  public callData(event?: PageEvent): void {
    const pageNum = event?.pageIndex ? event.pageIndex + 1 : 1;
    const pageSize = event?.pageSize ? event.pageSize : 12;
    this.spinner.show();
    this.marcaService.getPaginModelosByMarcas(this.marcaId, pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.modelos = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los Modelos:', err);
      },
    });
  }


  agregarModelo(): void {
    const dialogRef = this.dialog.open(AgregarModeloComponent, {
      width: '400px',
      data: { idMarca: this.marca.id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.marcaService.createModelo(result).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al crear el modelo:', err);
            this.snackBar.open('Hubo un error al crear el modelo.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  editarModelo(modelo: any): void {
    const dialogRef = this.dialog.open(AgregarModeloComponent, {
      width: '400px',
      data: { modelo, idMarca: this.marca.id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.marcaService.updateModelo(result).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al actualizar el modelo:', err);
            this.snackBar.open('Hubo un error al actualizar el modelo.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }

  eliminarModelo(id: number): void {
    Swal.fire({
      title: "Está seguro?",
      text: "El modelo quedará eliminado para siempre!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Borrar!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.marcaService.deleteModelo(this.marca.id, id).subscribe({
          next: (data) => {
            this.spinner.hide();
            this.callData();
            this.snackBar.open(data.msg, 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            this.spinner.hide();
            console.error('Error al eliminar el modelo:', err);
            this.snackBar.open('Hubo un error al eliminar el modelo.', 'Cerrar', { duration: 3000 });
          },
        });
      }
    });
  }


  volver(): void {
    this.router.navigate(['/admin/brands']);
  }
}
