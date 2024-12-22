import { Routes } from '@angular/router';
import { MisVehiculosComponent } from './mis-vehiculos/mis-vehiculos.component';

export const ClienteRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MisVehiculosComponent,
      },
    ],
  },
];
