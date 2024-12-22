import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(adminRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class AdminRoutingModule {}