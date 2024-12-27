import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientComponent } from './client.component';
import { NgModule } from '@angular/core';
import { ClientCarsComponent } from './components/client-cars/client-cars.component';
import { ClientServicesComponent } from './components/client-services/client-services.component';
import { DescubrirComponent } from '../pages/ui-components/descubrir/descubrir.component';
import { FormClientCarsComponent } from './components/form-client-cars/form-client-cars.component';

export const clientRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DescubrirComponent,
      },
      {
        path: 'cars',
        component: ClientCarsComponent,
      },
      {
        path: 'services',
        component: ClientServicesComponent,
      },
      {
        path: 'cars/form',
        component: FormClientCarsComponent,
      },

      
    ],
  },
];



@NgModule({
  imports: [RouterModule.forChild(clientRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class ClientRoutingModule {}
