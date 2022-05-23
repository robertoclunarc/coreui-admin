import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';



// Tabs Component

import { planillaConsultaComponent  } from './planilla_consulta.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule, 
    
  ],
  declarations: [   
    
    planillaConsultaComponent,
   
  ]
})
export class PlanillaModule { }
