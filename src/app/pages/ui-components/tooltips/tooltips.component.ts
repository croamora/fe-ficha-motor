import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TooltipPosition, MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, CalendarModule, CalendarEvent, CalendarEventTimesChangedEvent, DAYS_OF_WEEK } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { Subject } from 'rxjs';
import { CalendarConfigModule } from '../calendar/calendar-config/calendar-config.modulet';

@Component({
  selector: 'app-tooltips',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    CdkScrollable,
    MatButtonModule,
    MatTooltipModule, MatCardModule, MatInputModule, MatCheckboxModule,
    CalendarConfigModule
  ],
  templateUrl: './tooltips.component.html',
})
export class AppTooltipsComponent {

  viewDate = new Date();
  events: CalendarEvent[] = [];
  refresh = new Subject<void>();
  locale: string = 'es-CL';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  //  disabled
  disabled = new FormControl(false);

  // show and hide
  showDelay = new FormControl(1000);
  hideDelay2 = new FormControl(2000);

  // change message
  message = new FormControl('Info about the action');


  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }
  
}
