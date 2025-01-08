import { RouterModule, Routes } from '@angular/router';
import { StoreDashboardComponent } from './components/store-dashboard/store-dashboard.component';
import { NgModule } from '@angular/core';
import { StoreCotizationsComponent } from './components/store-cotizations/store-cotizations.component';
import { StoreWorkOrdersComponent } from './components/store-work-orders/store-work-orders.component';

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