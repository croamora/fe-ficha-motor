import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { AdminStoresComponent } from './component/admin-stores/admin-stores.component';
import { AdminBrandsComponent } from './component/admin-brands/admin-brands.component';
import { AdminModelsComponent } from './component/admin-models/admin-models.component';
import { AdminStoreFormComponent } from './component/admin-store-form/admin-store-form.component';
import { AdminUsersComponent } from './component/admin-users/admin-users.component';

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
      {
        path: 'stores/form',
        component: AdminStoreFormComponent,
      },
      {
        path: 'stores/form/:id',
        component: AdminStoreFormComponent,
      },
      {
        path: 'brands',
        component: AdminBrandsComponent,
      },
      {
        path: 'brands/models/:id',
        component: AdminModelsComponent,
      },
      {
        path: 'users',
        component: AdminUsersComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(adminRoutes)], // Configuración de rutas específicas para este módulo
  exports: [RouterModule], // Exporta el enrutamiento para que sea usado en el módulo
})
export class AdminRoutingModule {}