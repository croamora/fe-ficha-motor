import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { DescubrirComponent } from './ui-components/descubrir/descubrir.component';
import { DetalleEmpresaComponent } from './ui-components/detalle-empresa/detalle-empresa.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [ 
      { 
        path: '', 
        component: DescubrirComponent 
      },
      { 
        path: 'detalle-empresa/:id', 
        component: DetalleEmpresaComponent 
      },
    ],
  },
];
