import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargosAnterioresComponent } from './cargos_anteriores.component';


const routes: Routes = [
  {
    path: 'serviciomedico/cargosanteriores/:idPaciente',
    component: CargosAnterioresComponent,
    data: {
      title: 'Cargos Anteriores del Pacienten'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargosAntrioresRoutingModule {}
