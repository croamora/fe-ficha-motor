import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { AdminComponent } from './admin.component';
import { NgModule } from '@angular/core';
import { AdminStoresComponent } from './component/admin-stores/admin-stores.component';

export const adminRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'stores',
        component: AdminStoresComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(adminRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class AdminRoutingModule {}