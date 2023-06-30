import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargosOtrasEmpresasComponent } from './cargos_otras_empresas.component';


const routes: Routes = [
  {
    path: 'serviciomedico/cargosanteriores/:idPaciente',
    component: CargosOtrasEmpresasComponent,
    data: {
      title: 'Cargos en Otras Empresas del Pacienten'
    },    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargosOtrasEmpresasRoutingModule {}
