// Angular
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

//--import { CardsComponent } from '../../../views/base/cards.component';

// Forms Component
import { FormsComponent } from '../../../views/base/forms.component';

//--import { SwitchesComponent } from '../../../views/base/switches.component';
//--import { TablesComponent } from '../../../views/base/tables.component';

// Tabs Component
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ConsultasComponent } from './consultas.component';

// Carousel Component
//--import { CarouselModule } from 'ngx-bootstrap/carousel';
//--import { CarouselsComponent } from '../../../views/base/carousels.component';

// Collapse Component
import { CollapseModule } from 'ngx-bootstrap/collapse';
//--import { CollapsesComponent } from '../../../views/base/collapses.component';

// Dropdowns Component
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Pagination Component
import { PaginationModule } from 'ngx-bootstrap/pagination';
//--import { PopoversComponent } from '../../../views/base/popovers.component';

// Popover Component
import { PopoverModule } from 'ngx-bootstrap/popover';
//--import { PaginationsComponent } from '../../../views/base/paginations.component';

// Progress Component
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
//--import { ProgressComponent } from '../../../views/base/progress.component';

// Tooltip Component
import { TooltipModule } from 'ngx-bootstrap/tooltip';
//--import { TooltipsComponent } from '../../../views/base/tooltips.component';

// navbars
//--import { NavbarsComponent } from '../../../views/base/navbars/navbars.component';

// Modal Component
import { ModalModule } from 'ngx-bootstrap/modal';

// Components Routing
import { ConsultasRoutingModule } from './consultas-routing.module';

import { ChartsModule } from 'ng2-charts';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

//--import { AlertsComponent } from '../../../views/notifications/alerts.component'; //'./alerts.component';
import { AlertModule } from 'ngx-bootstrap/alert';

//import { PlanillaModule  } from '../planillas/planilla.module'
import { planillaConsultaComponent } from '../planillas/planilla_consulta.component';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ConsultasRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule,
    //--CarouselModule.forRoot(),
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ChartsModule,
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    NgxPrintModule
   // PlanillaModule
  ],
  declarations: [
    //--CardsComponent,
    ///--FormsComponent,
    //--SwitchesComponent,
    //--TablesComponent,
    ConsultasComponent,
    planillaConsultaComponent,
    //--CarouselsComponent,
    //-CollapsesComponent,
    //--PaginationsComponent,
    //--PopoversComponent,
    //--ProgressComponent,
    //--TooltipsComponent,
    //--NavbarsComponent,
   //--AlertsComponent
  ]
})
export class ConsultasModule { }