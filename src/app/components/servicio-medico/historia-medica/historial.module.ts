// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HistoriaMedicaComponent } from './historial.component';
import { HistoriaMedicaRoutingModule } from './historial-routing.module';
/*import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';*/

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HistoriaMedicaRoutingModule,    
    TabsModule,    
    /*PopoverModule.forRoot(),    
    TooltipModule.forRoot(),
    ModalModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),*/
  ],
  declarations: [
    
    HistoriaMedicaComponent,
    
  ]
})
export class HistorialConsultasModule { }
