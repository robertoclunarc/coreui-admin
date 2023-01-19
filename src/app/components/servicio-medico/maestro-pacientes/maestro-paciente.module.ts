// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MaestroPacienteComponent } from './maestro-paciente.component';
import { MestroPacienteRoutingModule } from './maestro-paciente-routing.module';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PacientesComponent } from '../pacientes/pacientes.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MestroPacienteRoutingModule,   
    TabsModule,PaginationModule.forRoot(), ModalModule.forRoot(),    
    PopoverModule.forRoot(),
    ModalModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    
    MaestroPacienteComponent,
    PacientesComponent
  ]
})
export class MaestroPacienteModule { }
