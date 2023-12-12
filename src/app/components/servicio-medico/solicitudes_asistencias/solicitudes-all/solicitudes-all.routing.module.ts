import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  SolicitudesALLComponent } from './solicitudes-all.component'

const routes: Routes = [
  {
    path: '',    
    data: {
      title: 'Solicitudes'
    },
    children: [
      {
        path: '',
        redirectTo: 'solicitudes'
      },
      {
        path: 'solicitudes',
        component: SolicitudesALLComponent,
        data: {
          title: 'Solicitudes'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class SolicitudesAllRoutingModule {}