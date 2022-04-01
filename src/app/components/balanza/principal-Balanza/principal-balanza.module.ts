console.log('componets/Balanza/principal-Balanza/principal-balanza.module.ts');
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { PrincipalBalanzaComponent } from './principal-balanza.component';
import { PrincipalBalanzaRouting } from './principal-balanza.routing';

@NgModule({
  imports: [
    FormsModule,
    PrincipalBalanzaRouting,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ PrincipalBalanzaComponent ]
})
export class DashboardModule { }
