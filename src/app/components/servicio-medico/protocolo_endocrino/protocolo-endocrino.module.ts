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
import { protocoloEndocrinoOneComponent } from '../protocolo_endocrino_one/protocolo-endocrino-one/protocolo-endocrino-one.component';
import { RiesgoGeneralOneComponent } from '../protocolo_endocrino_one/riesgo-general-one/riesgo-general-one.component';
import { RiesgosMetabolicosOneComponent } from '../protocolo_endocrino_one/riesgos-metabolicos-one/riegos-metabolicos-one.component';
import { EnfermedadActualOneComponent } from '../protocolo_endocrino_one/enfermedad-actual/enfermedad-actual-one.component';
import { UltimoChequeoOneComponent } from '../protocolo_endocrino_one/ultimo-chequeo-one/ultimo-chequeo-one.component';
import { ExamenFisicoOneComponent } from '../protocolo_endocrino_one/examen-fisico-one/examen-fisico-one.component';
import { auscultacionOneComponent } from '../protocolo_endocrino_one/auscultacion-one/auscultacion-one.component';
import { EstudiosLaboratorioOneComponent } from '../protocolo_endocrino_one/estudios-laboratorio-one/estudios-laboratorio-one.component';
import { CompromisosOneComponent } from '../protocolo_endocrino_one/compromisos-one/compromisos-one.component';
import { planillaProtocoloEndocrinoComponent } from '../planillas/planilla-protocolo-endrocrino.component';

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
    protocoloEndocrinoOneComponent,
    RiesgoGeneralOneComponent,
    RiesgosMetabolicosOneComponent,
    EnfermedadActualOneComponent,
    UltimoChequeoOneComponent,
    ExamenFisicoOneComponent,
    auscultacionOneComponent,
    EstudiosLaboratorioOneComponent,
    CompromisosOneComponent,
    planillaProtocoloEndocrinoComponent
  ]
})
export class ProtocoloEndocrinoModule { }
