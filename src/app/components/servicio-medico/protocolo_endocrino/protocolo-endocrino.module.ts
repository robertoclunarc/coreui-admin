// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProtocoloEndocrinoComponent } from './protocolo-endocrino.component';
import { protocoloEndocrinoRoutingModule } from './protocolo-endocrino-routing.module';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { protocoloEndocrinoOneComponent } from '../protocolo_endocrino_one/protocolo-endocrino-one.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    protocoloEndocrinoRoutingModule,   
    TabsModule,PaginationModule.forRoot(), ModalModule.forRoot(),    
    PopoverModule.forRoot(),
    ModalModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    
    ProtocoloEndocrinoComponent,
    protocoloEndocrinoOneComponent
  ]
})
export class ProtocoloEndocrinoModule { }
