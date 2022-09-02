import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
 
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginServicioMedicoComponent  } from './components/servicio-medico/login-servicio-medico/login-servicio-medico.component'
import { LoginBalanzaComponent  } from './components/balanza/login-balanza/login-balanza.component'
import { RegisterComponent } from './views/register/register.component';
//import { PacientesComponent } from './components/servicio-medico/pacientes/pacientes.component';
//import { CargosAnterioresComponent } from './components/servicio-medico/cargos_anteriores/cargos_anteriores.component';
//import { AntecedenteFamiliarComponent } from './components/servicio-medico/antecedentes_familiares/antecedentefamiliar.component';
//import { AntecedenteOcupacionalComponent } from './components/servicio-medico/antecedentes_ocupacionales/antecedenteocupacional.component';
//import { HistorialConsultasComponent  } from './components/servicio-medico/historial_consulta/historial_consulta.component';
import { ConsultaOneComponent  } from './components/servicio-medico/consulta_one/consulta_one.component';
//import { AntecedentePatologicoComponent  } from './components/servicio-medico/antecedentes_patologicos/antecedentepatologico.component';

import { PortadaComponent } from './views/portada/portada.component';
//import { HabitosComponent } from './components/servicio-medico/habitos/habitos.component';
//import { AnamnesisPsicologicoComponent } from './components/servicio-medico/anamnesis_psicologico/anamnesispsicologico.component';
//import { EstudiosFisicosComponent } from './components/servicio-medico/examen_fisico/examenfisico.component';
//import { SignosVitalesComponent } from './components/servicio-medico/signos_vitales/signosvitales.component';
//import { AntropometriaComponent } from './components/servicio-medico/antropometria/antropometria.component';


export const routes: Routes = [
  {
    path: 'serviciomedico/principal',
    redirectTo: 'serviciomedico/principal',    
    pathMatch: 'full',
  },
  {
    path: 'principalBalanza',
    redirectTo: 'principalBalanza',    
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
    path: 'serviciomedico',
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
    path: 'serviciomedico/login',
    component: LoginServicioMedicoComponent,
    data: {
      title: 'Login Page'
    }
  },
  /*{
    path: 'serviciomedico/pacientes',
    component: PacientesComponent,
    data: {
      title: 'Datos Paciente'
    }
  },*/
  /*{
    path: 'serviciomedico/cargosanteriores/:idPaciente',
    component: CargosAnterioresComponent,
    data: {
      title: 'Cargos Anteriores del Paciente',
    }
  },*/
  /*{
    path: 'serviciomedico/antecedentes/familiares/:idPaciente',
    component: AntecedenteFamiliarComponent,
    data: {
      title: 'Antecedentes Familiares del Paciente'
    }
  },*/
  /*{
    path: 'serviciomedico/antecedentes/ocupacionales/:idPaciente',
    component: AntecedenteOcupacionalComponent,
    data: {
      title: 'Antecedentes Ocupacionales del Paciente'
    }
  }, */
  /*{
    path: 'serviciomedico/antecedentes/patologicos/:idPaciente',
    component: AntecedentePatologicoComponent,
    data: {
      title: 'Antecedentes Patologicos del Paciente'
    }
  },*/
  /*{
    path: 'serviciomedico/habitos/:idPaciente',
    component: HabitosComponent,
    data: {
      title: 'Habitos del Paciente'
    }
  },*/
  /*{
    path: 'serviciomedico/examen/psicologico/:idPaciente',
    component: AnamnesisPsicologicoComponent,
    data: {
      title: 'Analisis Psicologico del Paciente'
    }
  }, */
  /*{
    path: 'serviciomedico/examen/fisico/:idPaciente',
    component: EstudiosFisicosComponent,
    data: {
      title: 'examen fisico del Paciente'
    }
  },*/
  /*{
    path: 'serviciomedico/historial/:idPaciente/:fechaIni/:fechaFin',
    component: HistorialConsultasComponent,
    data: {
      title: 'Historia del Paciente'
    }
  },*/
  /*{
    path: 'serviciomedico/examen/fisico/signosvitales/:idPaciente',
    component: SignosVitalesComponent,
    data: {
      title: 'Signos Vitales del Paciente'
    }
  },*/
  /*{
    path: 'serviciomedico/examen/fisico/antropometria/:idPaciente',
    component: AntropometriaComponent,
    data: {
      title: 'Datos Antropometricos del Paciente'
    }
  },*/
  {
    path: 'serviciomedico/consulta/:uidConsulta',
    component: ConsultaOneComponent,
    data: {
      title: 'Consulta del Paciente'
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
        path: 'serviciomedico/atenciones',
        loadChildren: () => import('./components/servicio-medico/consultas/consultas.module').then(m => m.ConsultasModule)
      },
      {
        path: 'serviciomedico/historia',
        loadChildren: () => import('./components/servicio-medico/historia-medica/historial.module').then(m => m.HistorialConsultasModule)
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
