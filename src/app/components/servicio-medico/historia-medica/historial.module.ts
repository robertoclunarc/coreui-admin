// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HistoriaMedicaComponent } from './historial.component';
import { HistoriaMedicaRoutingModule } from './historial-routing.module';
import { HistorialConsultasComponent } from '../historial_consulta/historial_consulta.component'
/*import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';*/
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConsultaOneComponent } from '../consulta_one/consulta_one.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HistoriaMedicaRoutingModule,    
    TabsModule,PaginationModule.forRoot(), ModalModule.forRoot(),
    //HistorialConsultasComponent,    
    /*PopoverModule.forRoot(),    
    TooltipModule.forRoot(),
    ModalModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),*/
  ],
  declarations: [
    
    HistoriaMedicaComponent,HistorialConsultasComponent,ConsultaOneComponent
    
  ]
})
export class HistorialConsultasModule { }
