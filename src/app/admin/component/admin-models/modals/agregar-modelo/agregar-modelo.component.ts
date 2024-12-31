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
import { MatSelectModule } from '@angular/material/select';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-agregar-modelo',
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
    MatCardModule,
    MatInputModule,
    MatCheckboxModule,
    TablerIconsModule,
    NgxSpinnerModule,
    MatIconModule,
  ],
  template: `
    <h1 mat-dialog-title>{{ data?.modelo ? 'Editar Modelo' : 'Agregar Modelo' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="modeloForm">
        <mat-form-field appearance="outline" class="full-width" style="margin-top: 20px;">
          <mat-label>Nombre del Modelo</mat-label>
          <input matInput formControlName="nombreModelo" />
          <mat-error *ngIf="modeloForm.get('nombreModelo')?.hasError('required')">
            Este campo es obligatorio
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="cerrar()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="modeloForm.invalid" (click)="guardar()">
        {{ data?.modelo ? 'Guardar Cambios' : 'Agregar' }}
      </button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class AgregarModeloComponent {
  modeloForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgregarModeloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { modelo?: any; idMarca: number }
  ) {
    this.modeloForm = this.fb.group({
      nombreModelo: [data?.modelo?.modelo || '', Validators.required]
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (this.modeloForm.valid) {
      this.dialogRef.close({
        id: this.data?.modelo?.id || null,
        idMarca: this.data.idMarca,
        modelo: this.modeloForm.value.nombreModelo
      });
    }
  }
}
