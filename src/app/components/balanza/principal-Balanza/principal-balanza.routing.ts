console.log('components/Balanza/principal-Balanza/principal-balanza.routing.ts');
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrincipalBalanzaComponent} from './principal-balanza.component';

const routes: Routes = [
  {
    path: '',
    component: PrincipalBalanzaComponent,
    data: {
      title: 'Principal',

    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrincipalBalanzaRouting {}