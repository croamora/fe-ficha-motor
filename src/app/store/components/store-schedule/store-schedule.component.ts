import { CdkScrollable } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarEvent, CalendarView, DAYS_OF_WEEK } from 'angular-calendar';
import { Subject } from 'rxjs';
import { CalendarConfigModule } from 'src/app/components/config-components/calendar-config.modulet';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-store-schedule',
  standalone: true,
  imports: [
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
    CalendarConfigModule,
    CommonModule 
  ],
  templateUrl: './store-schedule.component.html',
  styleUrl: './store-schedule.component.scss'
})
export class StoreScheduleComponent implements OnInit {
  

  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  
  viewDate = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  locale: string = 'es-CL';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;


  ngOnInit(): void {

  }


  setView(view: CalendarView) {
    this.view = view;
  }
  
  agendarModal(event: any): void {

    const formattedDate = new Intl.DateTimeFormat("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Usar formato 24 horas
    }).format(event.date);

    
    Swal.fire({
      title: "Hora Seleccionada",
      text: formattedDate,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Aceptar!",
      cancelButtonText: "Cancelar"
    })
  }

}
