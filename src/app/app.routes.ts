import { Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { ProfileGuard } from './guards/auth-profile.guard';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      
      {
        path: '',
        redirectTo: '/locales',
        pathMatch: 'full',
      },
      {
        path: 'ui-components',
        loadChildren: () =>
          import('./pages/ui-components/ui-components.routes').then(
            (m) => m.UiComponentsRoutes
          ),
      },
      
      {
        path: 'locales',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'admin',
        canActivate: [ProfileGuard],
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'client',
        canActivate: [ProfileGuard],
        loadChildren: () =>
          import('./client/client.module').then((m) => m.ClientModule),
      },
      {
        path: 'store',
        canActivate: [ProfileGuard],
        loadChildren: () =>
          import('./store/store.module').then((m) => m.StoreModule),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./pages/authentication/authentication.routes').then(
            (m) => m.AuthenticationRoutes
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
