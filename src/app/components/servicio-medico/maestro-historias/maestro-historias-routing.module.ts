import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaestroHistoriasComponent } from './maestro-historias.component'

const routes: Routes = [
  {
    path: '',    
    data: {
      title: 'Historias'
    },
    children: [
      {
        path: '',
        redirectTo: 'historias'
      },
      {
        path: 'historias',
        component: MaestroHistoriasComponent,
        data: {
          title: 'Historias'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class MestroHistoriasRoutingModule {}