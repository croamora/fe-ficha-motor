import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ServicioService } from 'src/app/services/servicio.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-work-order-services-selection-dialog',
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
    MatAutocompleteModule,
    MatTableModule,
  ],
  templateUrl: './work-order-services-selection-dialog.component.html',
  styleUrl: './work-order-services-selection-dialog.component.scss'
})
export class WorkOrderServicesSelectionDialogComponent implements OnInit{

  displayedColumns: string[] = ['select', 'categoria', 'servicio', 'precio'];
  servicios: MatTableDataSource<any>;
  serviciosSeleccionados: any[] = [];
  pageIndex: number;
  length: number;
  palabraClave: string = '';
  searchTerm: string = '';

  constructor(
    public dialogRef: MatDialogRef<WorkOrderServicesSelectionDialogComponent>,
    private servicioService: ServicioService,
    private storageService: StorageService, 
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
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
  

  toggleServiceSelection(servicio: any, isChecked: boolean): void {
    if (isChecked) {
      this.serviciosSeleccionados.push(servicio);
    } else {
      const index = this.serviciosSeleccionados.findIndex(s => s.id === servicio.id);
      if (index !== -1) {
        this.serviciosSeleccionados.splice(index, 1);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.serviciosSeleccionados);
  }
}