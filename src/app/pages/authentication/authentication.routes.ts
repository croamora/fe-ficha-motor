import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
import { AppSideRegisterComponent } from './side-register/side-register.component';
import { SidePasswordRecoverRequestComponent } from './side-password-recover-request/side-password-recover-request.component';
import { SidePasswordRecoverComponent } from './side-password-recover/side-password-recover.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'request-recover',
        component: SidePasswordRecoverRequestComponent,
      },
      {
        path: 'recover',
        component: SidePasswordRecoverComponent,
      },
    ],
  },
];
