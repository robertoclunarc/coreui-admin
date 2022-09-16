import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultasComponent } from './consultas.component';
//import { planillaConsultaComponent } from '../planillas/planilla_consulta.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Atenciones'
    },
    children: [
      {
        path: '',
        redirectTo: 'atenciones',
        pathMatch: 'full',
      },
      {
        path: 'atenciones',
        component: ConsultasComponent,
        data: {
          title: 'Atenciones'
        }
      },      
      /*{
        path: 'serviciomedico/atenciones/planillaconsulta/:uid',
        component: planillaConsultaComponent,
        data: {
          title: 'Consulta'
        }
      },*/
      /*{
        path: 'serviciomedico/medicos',
        loadChildren: () => import('../planillas/planilla.module').then(m => m.PlanillaModule)
      }, */           
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class ConsultasRoutingModule {}
