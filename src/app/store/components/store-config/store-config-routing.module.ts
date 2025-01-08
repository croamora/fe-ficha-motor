import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StoreConfigUsersComponent } from './components/store-config-users/store-config-users.component';
import { StoreConfigDisponibilityComponent } from './components/store-config-disponibility/store-config-disponibility.component';
import { StoreConfigPricesComponent } from './components/store-config-prices/store-config-prices.component';
import { StoreConfigServicesComponent } from './components/store-config-services/store-config-services.component';

export const storeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        component: StoreConfigUsersComponent,
      },
      {
        path: 'disponibility',
        component: StoreConfigDisponibilityComponent,
      },
      {
        path: 'services',
        component: StoreConfigServicesComponent,
      }, 
      {
        path: 'prices',
        component: StoreConfigPricesComponent,
      },
    ],
  },
];



@NgModule({
  imports: [RouterModule.forChild(storeRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class StoreConfigRoutingModule {}