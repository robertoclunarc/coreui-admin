// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SolicitudesALLComponent } from './solicitudes-all.component';
import { SolicitudesAllRoutingModule } from './solicitudes-all.routing.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { planillaSolicitudComponent } from '../../planillas/planilla_solicitud/planilla-solicitud.component';
import { ConsultaOneComponent } from '../../consulta_one/consulta_one.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SolicitudesAllRoutingModule,   
    TabsModule,PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [    
    SolicitudesALLComponent,
    planillaSolicitudComponent,
    ConsultaOneComponent,
  ]
})
export class SolicitudesAllModule { }
