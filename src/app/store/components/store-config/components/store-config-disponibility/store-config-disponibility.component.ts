import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxSpinnerModule } from 'ngx-spinner';

interface TimeSlot {
  open: string | null;
  close: string | null;
}


@Component({
  selector: 'app-store-config-disponibility',
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
    NgxSpinnerModule,
    MatIconModule,
    MatDialogModule,
    NgxMaterialTimepickerModule
  ],
  templateUrl: './store-config-disponibility.component.html',
  styleUrl: './store-config-disponibility.component.scss'
})
export class StoreConfigDisponibilityComponent implements OnInit {
  form: FormGroup;
  days: { name: string; times: FormGroup[] }[] = [
    { name: 'Lunes', times: [] },
    { name: 'Martes', times: [] },
    { name: 'Miércoles', times: [] },
    { name: 'Jueves', times: [] },
    { name: 'Viernes', times: [] },
    { name: 'Sábado', times: [] },
    { name: 'Domingo', times: [] }
  ];
  

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({});

    this.days.forEach((_, i) => {
      this.form.addControl('closed_' + i, this.fb.control(false));
      this.addTimeSlot(i); // Inicializa un grupo de tiempo por defecto
    });
  }

  addTimeSlot(dayIndex: number): void {
    const timeGroup = this.fb.group({
      open: ['', Validators.required],
      close: ['', Validators.required]
    });
  
    this.days[dayIndex].times.push(timeGroup); 
  
    // Crea los nombres únicos para cada control
    const openControlName = 'time_' + dayIndex + '_' + (this.days[dayIndex].times.length - 1) + '_open';
    const closeControlName = 'time_' + dayIndex + '_' + (this.days[dayIndex].times.length - 1) + '_close';
  
    // Añade los controles al FormGroup
    this.form.addControl(openControlName, timeGroup.get('open')!);
    this.form.addControl(closeControlName, timeGroup.get('close')!);
  }
  
  

  toggleDayState(dayIndex: number): void {
    const isClosed = this.form.get('closed_' + dayIndex)?.value;

    // Si el día está marcado como cerrado, eliminar los horarios
    if (isClosed) {
      this.days[dayIndex].times.forEach((_, i) => {
        const controlName = 'time_' + dayIndex + '_' + i;
        this.form.removeControl(controlName);
      });
      this.days[dayIndex].times = [];
    } else {
      // Si el día se abre, agregar un horario por defecto
      this.addTimeSlot(dayIndex);
    }
  }

  save(): void {
    if (this.form.valid) {
      const schedule = this.days.map((day, i) => ({
        day: day.name,
        closed: this.form.get('closed_' + i)?.value,
        times: day.times.map((timeGroup) => ({
          open: timeGroup.get('open')?.value,
          close: timeGroup.get('close')?.value
        }))
      }));
      console.log('Schedule:', schedule);
    } else {
      console.log('Form is invalid');
    }
  }

  removeTimeSlot(dayIndex: number, timeIndex: number): void {
    this.days[dayIndex].times.splice(timeIndex, 1);
  }
}