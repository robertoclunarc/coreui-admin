import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  HistoriaMedicaComponent } from './historial.component'

const routes: Routes = [
  {
    path: 'serviciomedico/historia',
    component: HistoriaMedicaComponent,
    data: {
      title: 'Historia'
    },
    children: [
      /*{
        path: '',
        redirectTo: 'serviciomedico/Atenciones'
      },*/
      {
        path: 'serviciomedico/historia',
        component: HistoriaMedicaComponent,
        data: {
          title: 'Historia Medica'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class HistoriaMedicaRoutingModule {}