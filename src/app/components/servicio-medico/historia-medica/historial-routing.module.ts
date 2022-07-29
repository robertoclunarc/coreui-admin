import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  HistoriaMedicaComponent } from './historial.component'

const routes: Routes = [
  {
    path: '',    
    data: {
      title: 'Historia'
    },
    children: [
      {
        path: '',
        redirectTo: 'historia'
      },
      {
        path: 'historia',
        component: HistoriaMedicaComponent,
        data: {
          title: 'Historia'
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