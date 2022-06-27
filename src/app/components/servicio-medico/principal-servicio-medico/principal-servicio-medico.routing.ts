import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalServicioMedicoComponent} from './principal-servicio-medico.component';

const routes: Routes = [
  {
    path: 'serviciomedico',
    component: PrincipalServicioMedicoComponent,
    data: {
      title: 'Principal',

    }
  },
  {
    path: '',
    component: PrincipalServicioMedicoComponent,
    data: {
      title: 'Principal',

    }
  },
  {
    path: 'serviciomedico/principal',
    component: PrincipalServicioMedicoComponent,
    data: {
      title: 'Principal',

    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalServicioMedicoRouting {}