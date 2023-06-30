// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { HistoriaMedicaComponent } from './historial.component';
import { HistoriaMedicaRoutingModule } from './historial-routing.module';
import { HistorialConsultasComponent } from '../historial_consulta/historial_consulta.component'
import { PopoverModule } from 'ngx-bootstrap/popover';
//import { TooltipModule } from 'ngx-bootstrap/tooltip';
//import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AlertModule } from 'ngx-bootstrap/alert';
// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ConsultaOneComponent } from '../consulta_one/consulta_one.component';
import { CargosAnterioresComponent } from '../cargos_anteriores/cargos_anteriores.component';
import { AntecedenteFamiliarComponent } from '../antecedentes_familiares/antecedentefamiliar.component';
import { AntecedenteOcupacionalComponent } from '../antecedentes_ocupacionales/antecedenteocupacional.component';
import { AntecedentePatologicoComponent } from '../antecedentes_patologicos/antecedentepatologico.component';
import { HabitosComponent } from '../habitos/habitos.component';
import { AnamnesisPsicologicoComponent } from '../anamnesis_psicologico/anamnesispsicologico.component';
import { SignosVitalesComponent } from '../signos_vitales/signosvitales.component';
import { AntropometriaComponent } from '../antropometria/antropometria.component';
import { EstudiosFisicosComponent } from '../examen_fisico/examenfisico.component';
import { PacientesHistoriaComponent } from '../paciente-historia/pacientes.component';
import { planillaHistoriaComponent } from '../planillas/planilla_historia/planilla-historia.component';
import { CargosOtrasEmpresasComponent } from '../cargos_otras_empresas/cargos_otras_empresas.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HistoriaMedicaRoutingModule,    
    TabsModule,PaginationModule.forRoot(), ModalModule.forRoot(),
    //HistorialConsultasComponent,    
    PopoverModule.forRoot(),    
    //TooltipModule.forRoot(),
    //ModalModule.forRoot(),    
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    //PacientesModule
  ],
  
  declarations: [
    
    HistoriaMedicaComponent,
    HistorialConsultasComponent,
    ConsultaOneComponent, 
    CargosAnterioresComponent,
    CargosOtrasEmpresasComponent, 
    AntecedenteFamiliarComponent,
    AntecedenteOcupacionalComponent,
    AntecedentePatologicoComponent,
    HabitosComponent,
    AnamnesisPsicologicoComponent,
    SignosVitalesComponent,
    AntropometriaComponent,
    EstudiosFisicosComponent, 
    PacientesHistoriaComponent,
    planillaHistoriaComponent,  
  ]
})
export class HistorialModule { }
