import { RouterModule, Routes } from '@angular/router';
import { StoreDashboardComponent } from './components/store-dashboard/store-dashboard.component';
import { NgModule } from '@angular/core';

export const storeRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: StoreDashboardComponent,
      },
    ],
  },
];



@NgModule({
  imports: [RouterModule.forChild(storeRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class StoreRoutingModule {}