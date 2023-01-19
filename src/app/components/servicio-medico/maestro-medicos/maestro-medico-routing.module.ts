import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  MaestroMedicoComponent } from './maestro-medico.component'

const routes: Routes = [
  {
    path: '',    
    data: {
      title: 'Medicos'
    },
    children: [
      {
        path: '',
        redirectTo: 'medicos'
      },
      {
        path: 'medicos',
        component: MaestroMedicoComponent,
        data: {
          title: 'Medicos'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class MestroMedicoRoutingModule {}