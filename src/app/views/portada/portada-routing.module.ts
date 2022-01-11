import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PortadaComponent } from './portada.component';

const routes: Routes = [
  {
    path: '',
    component: PortadaComponent,
    data: {
      title: 'Portada'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortadaRoutingModule {}
