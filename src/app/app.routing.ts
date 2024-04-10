import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Import Containers
import { DefaultLayoutComponent } from './containers'; 
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginServicioMedicoComponent  } from './components/servicio-medico/login-servicio-medico/login-servicio-medico.component';
import { RegisterComponent } from './views/register/register.component';
import { ConsultaOneComponent  } from './components/servicio-medico/consulta_one/consulta_one.component';
import { SolicitudComponent } from './components/servicio-medico/solicitudes_asistencias/solicitud-one/solicitud.component';

export const routes: Routes = [
  {
    path: 'serviciomedico/principal',
    redirectTo: 'serviciomedico/principal',    
    pathMatch: 'full',
  },
  {
    path: 'serviciomedico/solicitud',
    component: SolicitudComponent,
    data: {
      title: 'Solicitud de Asistencia'
    }
  },
  {
    path: '',
    component: LoginServicioMedicoComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'serviciomedico',
    component: LoginServicioMedicoComponent,
    data: {
      title: 'Login Page'
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
    path: 'serviciomedico/login',
    component: LoginServicioMedicoComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'serviciomedico/consulta/:uidConsulta',
    component: ConsultaOneComponent,
    data: {
      title: 'Consulta del Paciente'
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
        path: 'serviciomedico/atenciones',
        loadChildren: () => import('./components/servicio-medico/consultas/consultas.module').then(m => m.ConsultasModule)
      },
      {
        path: 'serviciomedico/atenciones/:idsolicitud',
        loadChildren: () => import('./components/servicio-medico/consultas/consultas.module').then(m => m.ConsultasModule)
      },
      {
        path: 'serviciomedico/solicitudes/nueva',
        component: SolicitudComponent,
        data: {
          title: 'Nueva Solicitud de Asistencia'
        }
      },
      {
        path: 'serviciomedico/solicitudes',
        loadChildren: () => import('./components/servicio-medico/solicitudes_asistencias/solicitudes-all/solicitudes-all.module').then(m => m.SolicitudesAllModule)
      },
      {
        path: 'serviciomedico/historia',
        loadChildren: () => import('./components/servicio-medico/historia-medica/historial.module').then(m => m.HistorialModule)
      }, 
      {
        path: 'serviciomedico/pacientes',
        loadChildren: () => import('./components/servicio-medico/maestro-pacientes/maestro-paciente.module').then(m => m.MaestroPacienteModule)
      },      
      {
        path: 'serviciomedico/principal',
        loadChildren: () => import('./components/servicio-medico/principal-servicio-medico/principal-servicio-medico.module').then(m => m.DashboardModule)
      },      
      {
        path: 'serviciomedico/medicos',
        loadChildren: () => import('./components/servicio-medico/maestro-medicos/maestro-medico.module').then(m => m.MaestroMedicoModule)
      },
      {
        path: 'serviciomedico/historias',
        loadChildren: () => import('./components/servicio-medico/maestro-historias/maestro-historias.module').then(m => m.MaestrHistoriasModule)
      },
      {
        path: 'serviciomedico/protocolo-endocrino',
        loadChildren: () => import('./components/servicio-medico/protocolo_endocrino/protocolo-endocrino.module').then(m => m.ProtocoloEndocrinoModule)
      },
      {
        path: 'serviciomedico/morbilidad',
        loadChildren: () => import('./components/servicio-medico/morbilidad/morbilidad.module').then(m => m.MorbilidadModule)
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
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
