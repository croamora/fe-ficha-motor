import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-servicio-modal',
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
  template: `
    <div style="padding: 10px;">
      <h1 mat-dialog-title>{{ data?.servicio ? 'Editar Servicio' : 'Agregar Servicio' }}</h1>
      <div mat-dialog-content>
        <form [formGroup]="servicioForm">
          <mat-form-field appearance="outline" class="full-width" style="margin-top: 20px;">
            <mat-label>Servicio</mat-label>
            <input matInput formControlName="nombreServicio" />
            <mat-error *ngIf="servicioForm.get('nombreServicio')?.hasError('required')">
              Este campo es obligatorio
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" style="margin-top: 10px;">
            <mat-label>Precio</mat-label>
            <input matInput type="number" formControlName="precioServicio" />
            <mat-error *ngIf="servicioForm.get('precioServicio')?.hasError('required')">
              Este campo es obligatorio
            </mat-error>
          </mat-form-field>

        </form>
      </div>
      <div mat-dialog-actions align="end">
        <button mat-button (click)="cerrar()">Cancelar</button>
        <button mat-raised-button color="primary" [disabled]="servicioForm.invalid" (click)="guardar()">
          {{ data?.servicio ? 'Guardar Cambios' : 'Agregar' }}
        </button>
      </div>
    </div> 
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class ServicioModalComponent {
  servicioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServicioModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { servicio?: any }
  ) {
    this.servicioForm = this.fb.group({
      nombreServicio: [data?.servicio?.servicio || '', Validators.required],
      precioServicio: [data?.servicio?.precio?.precio || '', [Validators.required, Validators.pattern(/^\d+$/)] ]
    });

    if (data && !data?.servicio?.idTaller) {
      this.servicioForm.get('nombreServicio')?.disable();
    }
  }

  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (this.servicioForm.valid) {
      const precio = parseInt(this.servicioForm.value.precioServicio, 10);
      this.dialogRef.close({
        id: this.data?.servicio?.id || null,
        servicio: this.servicioForm.value.nombreServicio,
        precio
      });
    }
  }
}
