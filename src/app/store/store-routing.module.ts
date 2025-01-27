import { RouterModule, Routes } from '@angular/router';
import { StoreDashboardComponent } from './components/store-dashboard/store-dashboard.component';
import { NgModule } from '@angular/core';
import { StoreCotizationsComponent } from './components/store-cotizations/store-cotizations.component';
import { StoreWorkOrdersComponent } from './components/store-work-orders/store-work-orders.component';
import { StoreScheduleComponent } from './components/store-schedule/store-schedule.component';
import { WorkOrderFormComponent } from './components/store-work-orders/components/work-order-form/work-order-form.component';

export const storeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: StoreDashboardComponent,
      },
      {
        path: 'cotizations',
        component: StoreCotizationsComponent,
      },
      {
        path: 'orders',
        component: StoreWorkOrdersComponent,
      },
      {
        path: 'orders/form',
        component: WorkOrderFormComponent,
      },
      {
        path: 'orders/form/:id',
        component: WorkOrderFormComponent,
      },
      {
        path: 'schedule',
        component: StoreScheduleComponent,
      },
      {
        path: 'config',
        loadChildren: () =>
          import('./components/store-config/store-config.module').then((m) => m.StoreConfigModule),
      },
      
    ],
  },
];



@NgModule({
  imports: [RouterModule.forChild(storeRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class StoreRoutingModule {}