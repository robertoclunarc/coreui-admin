// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CargosAntrioresRoutingModule } from './cargos_anteriores-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CargosAntrioresRoutingModule,
    BsDropdownModule.forRoot(),   
    CarouselModule.forRoot(),
    CollapseModule.forRoot(),    
    PopoverModule.forRoot(),    
    TooltipModule.forRoot()
  ],
  declarations: [  
  ]
})
export class CargosAnterioresModule { }
