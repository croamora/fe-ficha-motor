import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { WorkOrderServicesSelectionDialogComponent } from '../work-order-services-selection-dialog/work-order-services-selection-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { ServicioOT } from 'src/app/models/servicio-OT-model';

@Component({
  selector: 'app-work-order-services-form',
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
    WorkOrderServicesSelectionDialogComponent,
    MatTableModule,
  ],
  templateUrl: './work-order-services-form.component.html',
  styleUrl: './work-order-services-form.component.scss'
})
export class WorkOrderServicesFormComponent implements OnInit {

  @Input() services!: ServicioOT[];
  @Input() idWorkOrder!: number;
  @Output() servicesChange = new EventEmitter<any>();


  
  constructor(
    private router : Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}


  ngOnInit(): void {


  }


    expandedRows: Set<any> = new Set(); // Controla qué filas están expandidas

  toggleRow(servicio: any) {
    if (servicio.especial) {
      if (this.expandedRows.has(servicio)) {
        this.expandedRows.delete(servicio);
      } else {
        this.expandedRows.add(servicio);
      }
    }
  }


  agregarServicio(): void {
    const dialogRef = this.dialog.open(WorkOrderServicesSelectionDialogComponent, {
      width: '800px',
      data: { services: this.services }
    });

    dialogRef.afterClosed().subscribe(selectedServices => {
      if (selectedServices) {
        const nuevosServicios = selectedServices.map((servicio: any): ServicioOT => {
          return {
            id: null,
            idServicio: servicio.id,
            servicio: servicio.servicio,
            cantidad: 1,
            precio: servicio.precio, 
            especial: servicio.especial
          };
        });

        this.services = [...this.services, ...nuevosServicios];
        console.log(this.services)
        this.servicesChange.emit(this.services);
      }
    });
  }

}
