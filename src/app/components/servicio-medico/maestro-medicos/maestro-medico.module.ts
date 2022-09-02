// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MaestroMedicoComponent } from './maestro-medico.component';
import { MestroMedicoRoutingModule } from './maestro-medico-routing.module';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MedicosComponent } from '../medicos/medicos.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MestroMedicoRoutingModule,   
    TabsModule,PaginationModule.forRoot(), ModalModule.forRoot(),    
    PopoverModule.forRoot(),
    ModalModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    
  ],
  declarations: [
    
    MaestroMedicoComponent,
    MedicosComponent
  ]
})
export class MaestroMedicoModule { }
