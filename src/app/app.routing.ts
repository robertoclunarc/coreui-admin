console.log('views.portada.routing');
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
 
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
//import { LoginComponent } from './views/login/login.component';
import { LoginServicioMedicoComponent  } from './components/login-servicio-medico/login-servicio-medico.component'
import { LoginBalanzaComponent  } from './components/balanza/login-balanza/login-balanza.component'
import { RegisterComponent } from './views/register/register.component';
//import { PacientesComponent } from './components/pacientes/pacientes.component';
//import { PrincipalServicioMedicoComponent } from './components/principal-servicio-medico/principal-servicio-medico.component';
import { PortadaComponent } from './views/portada/portada.component';
//import {  ConsultasComponent } from './components/consultas/consultas.component';

export const routes: Routes = [
  {
    path: 'principal',
    redirectTo: 'principal',
    //component: PrincipalServicioMedicoComponent,
    pathMatch: 'full',
  },
  {
    path: 'principalBalanza',
    redirectTo: 'principalBalanza',
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
  /*{
    path: 'consultas',
    component: TabsComponent,
    data: {
      title: 'Consultas'
    }
  },*/
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
    path: 'loginBalanza',
    component: LoginBalanzaComponent,
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
        path: 'consultas',
        loadChildren: () => import('./components/consultas/consultas.module').then(m => m.ConsultasModule)
      },
      {
        path: 'pesajeconsultas',
        loadChildren: () => import('./components/balanza/consultas/consultas.module').then(m => m.ConsultasModule)
      },
      {
        path: 'principal',
        loadChildren: () => import('./components/principal-servicio-medico/principal-servicio-medico.module').then(m => m.DashboardModule)
      },
      {
        path: 'principalBalanza',
        loadChildren: () => import('./components/balanza/principal-Balanza/principal-balanza.module').then(m => m.DashboardModule)
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
