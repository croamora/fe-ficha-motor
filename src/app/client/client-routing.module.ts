import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { ClientComponent } from './client.component';
import { NgModule } from '@angular/core';

export const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: ClientDashboardComponent,
      },
    ],
  },
];



@NgModule({
  imports: [RouterModule.forChild(clientRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class ClientRoutingModule {}
