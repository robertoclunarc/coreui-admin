import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
//import { LoginComponent } from './views/login/login.component';
import { LoginServicioMedicoComponent  } from './components/login-servicio-medico/login-servicio-medico.component'
import { RegisterComponent } from './views/register/register.component';
//import { PacientesComponent } from './components/pacientes/pacientes.component';
//import { PrincipalServicioMedicoComponent } from './components/principal-servicio-medico/principal-servicio-medico.component';
import { PortadaComponent } from './views/portada/portada.component';

export const routes: Routes = [
  {
    path: 'principal',
    redirectTo: 'principal',
    //component: PrincipalServicioMedicoComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    component: PortadaComponent,
    data: {
      title: 'Portada'
    }
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginServicioMedicoComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'base',
        loadChildren: () => import('./views/base/base.module').then(m => m.BaseModule)
      },
      {
        path: 'principal',
        loadChildren: () => import('./components/principal-servicio-medico/principal-servicio-medico.module').then(m => m.DashboardModule)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/buttons.module').then(m => m.ButtonsModule)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/chartjs/chartjs.module').then(m => m.ChartJSModule)
      },
      /*{
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },*/
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then(m => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then(m => m.ThemeModule)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then(m => m.WidgetsModule)
      },
      /*{
        path: 'Pacientes',
        component: PacientesComponent,
        data: {
          title: 'Pacientes Page'
        }
      },*/
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
