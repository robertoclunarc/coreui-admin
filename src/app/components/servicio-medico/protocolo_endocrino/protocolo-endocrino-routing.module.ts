import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {  ProtocoloEndocrinoComponent } from './protocolo-endocrino.component'

const routes: Routes = [
  {
    path: '',    
    data: {
      title: 'Protocolo Endocrino'
    },
    children: [
      {
        path: '',
        redirectTo: 'protocolo-endocrino'
      },
      {
        path: 'protocolo-endocrino',
        component:ProtocoloEndocrinoComponent,
        data: {
          title: 'protocolo-endocrino'
        }
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),  ], 
  exports: [RouterModule]
})
export class protocoloEndocrinoRoutingModule {}