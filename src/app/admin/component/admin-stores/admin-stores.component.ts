import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { TallerService } from 'src/app/services/taller.service';

@Component({
  selector: 'app-admin-stores',
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
    MatTableModule 
  ],
  templateUrl: './admin-stores.component.html',
  styleUrl: './admin-stores.component.scss'
})
export class AdminStoresComponent implements OnInit {

  displayedColumns: string[] = ['nombre', 'direccion', 'telefono', 'acciones'];
  talleres: MatTableDataSource<any>;
  pageIndex: number;
  length: number;
  palabraClave: string = '';

  constructor(
    private router: Router,
    private tallerService: TallerService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
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
    this.tallerService.getTalleres(pageNum, pageSize, this.palabraClave).subscribe({
      next: (response) => {
        this.spinner.hide();
        this.pageIndex = response.pageNum - 1;
        this.length = response.total;
        this.talleres = new MatTableDataSource(response.list);
      },
      error: (err) => {
        this.spinner.hide();
        console.error('Error al cargar los talleres:', err);
      },
    });
  }

  agregarTaller(): void {
    this.router.navigate(['/admin/stores/form']);
  }

  editarTaller(taller: any): void {
    this.router.navigate(['/editar-taller', taller.id]);
  }

  eliminarTaller(id: number): void {
  //   if (confirm('¿Estás seguro de que deseas eliminar este taller?')) {
  //     this.spinner.show();
  //     this.tallerService.deleteTaller(id).subscribe({
  //       next: () => {
  //         this.spinner.hide();
  //         this.callData();
  //         this.snackBar.open('Taller eliminado con éxito.', 'Cerrar', { duration: 3000 });
  //       },
  //       error: (err) => {
  //         this.spinner.hide();
  //         console.error('Error al eliminar el taller:', err);
  //         this.snackBar.open('Hubo un error al eliminar el taller.', 'Cerrar', { duration: 3000 });
  //       },
  //     });
  //   }
  }
}