import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MarcaService } from 'src/app/services/marca.service';
import { VehiculoService } from 'src/app/services/vehiculo.service';

@Component({
  selector: 'app-admin-store-form',
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
  templateUrl: './admin-store-form.component.html',
  styleUrl: './admin-store-form.component.scss'
})
export class AdminStoreFormComponent implements OnInit {


  constructor(
    private router : Router,
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private marcaService: MarcaService
  ) {}



  ngOnInit(): void {

  }


  volver(): void {
    this.router.navigate(['/admin/stores']);
  }

}
