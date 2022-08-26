import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  MaestroPacienteComponent } from './maestro-paciente.component'

const routes: Routes = [
  {
    path: '',    
    data: {
      title: 'Pacientes'
    },
    children: [
      {
        path: '',
        redirectTo: 'pacientes'
      },
      {
        path: 'pacientes',
        component: MaestroPacienteComponent,
        data: {
          title: 'Pacientes'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class MestroPacienteRoutingModule {}