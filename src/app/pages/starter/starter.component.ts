import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { AppProfitExpensesComponent } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { AppProductSalesComponent } from 'src/app/components/product-sales/product-sales.component';
import { AppUpcomingSchedulesComponent } from 'src/app/components/upcoming-schedules/upcoming-schedules.component';
import { AppTopEmployeesComponent } from 'src/app/components/top-employees/top-employees.component';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  DAYS_OF_WEEK,
} from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';



@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    MaterialModule,
    AppProfitExpensesComponent,
    AppTrafficDistributionComponent,
    AppProductSalesComponent,
    AppUpcomingSchedulesComponent,
    AppTopEmployeesComponent
  ],
  templateUrl: './starter.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent { 

  
}