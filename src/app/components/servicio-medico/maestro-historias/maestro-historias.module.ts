// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MaestroHistoriasComponent } from './maestro-historias.component';
import { MestroHistoriasRoutingModule } from './maestro-historias-routing.module';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MestroHistoriasRoutingModule,   
    TabsModule,PaginationModule.forRoot(), ModalModule.forRoot(),    
    PopoverModule.forRoot(),
    ModalModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
   
  ],
  declarations: [
    
    MaestroHistoriasComponent,
   
  ]
})
export class MaestrHistoriasModule { }
