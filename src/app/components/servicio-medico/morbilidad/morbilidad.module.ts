// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MorbilidadComponent } from './morbilidad.component';
import { MorbilidadRoutingModule } from './morbilidad-routing.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
//import { TooltipModule } from 'ngx-bootstrap/tooltip';
//import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MorbilidadRoutingModule,    
    TabsModule,PaginationModule.forRoot(), ModalModule.forRoot(),   
    PopoverModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),    
  ],
  
  declarations: [    
    MorbilidadComponent,    
  ]
})
export class MorbilidadModule { }
