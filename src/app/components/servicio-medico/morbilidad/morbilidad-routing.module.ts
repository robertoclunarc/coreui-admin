import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  MorbilidadComponent } from './morbilidad.component'

const routes: Routes = [
  {
    path: '',    
    data: {
      title: 'Morbilidad'
    },
    children: [
      {
        path: '',
        redirectTo: 'morbilidad',
        pathMatch: 'full',
      },
      {
        path: 'morbilidad',
        component: MorbilidadComponent,
        data: {
          title: 'Morbilidad'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class MorbilidadRoutingModule {}