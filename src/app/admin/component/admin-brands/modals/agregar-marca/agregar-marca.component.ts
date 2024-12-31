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
  selector: 'app-agregar-marca',
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
    <h1 mat-dialog-title>{{ data?.marca ? 'Editar Marca' : 'Agregar Marca' }}</h1>
    <div mat-dialog-content>
      <form [formGroup]="marcaForm">
        <mat-form-field appearance="outline" class="full-width" style="margin-top: 20px;">
          <mat-label>Nombre de la Marca</mat-label>
          <input matInput formControlName="nombreMarca" />
          <mat-error *ngIf="marcaForm.get('nombreMarca')?.hasError('required')">
            Este campo es obligatorio
          </mat-error>
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="cerrar()">Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="marcaForm.invalid" (click)="guardar()">
        {{ data?.marca ? 'Guardar Cambios' : 'Agregar' }}
      </button>
    </div>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
  `]
})
export class AgregarMarcaComponent {
  marcaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AgregarMarcaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { marca?: any }
  ) {
    this.marcaForm = this.fb.group({
      nombreMarca: [data?.marca?.marca || '', Validators.required]
    });
  }

  cerrar() {
    this.dialogRef.close();
  }

  guardar() {
    if (this.marcaForm.valid) {
      this.dialogRef.close({
        id: this.data?.marca?.id || null,
        marca: this.marcaForm.value.nombreMarca
      });
    }
  }
}
