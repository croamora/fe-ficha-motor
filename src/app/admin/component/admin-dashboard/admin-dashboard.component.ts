import { Component } from '@angular/core';
import { AppProductSalesComponent } from 'src/app/components/product-sales/product-sales.component';
import { AppProfitExpensesComponent } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTopEmployeesComponent } from 'src/app/components/top-employees/top-employees.component';
import { AppTrafficDistributionComponent } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { AppUpcomingSchedulesComponent } from 'src/app/components/upcoming-schedules/upcoming-schedules.component';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    AppProfitExpensesComponent,
    AppTrafficDistributionComponent,
    AppProductSalesComponent,
    AppUpcomingSchedulesComponent,
    AppTopEmployeesComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

}
