import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { PortadaComponent } from './portada.component';
import { PortadaRoutingModule } from './portada-routing.module';

@NgModule({
  imports: [
    FormsModule,
    PortadaRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ PortadaComponent ]
})
export class PortadaModule { }
