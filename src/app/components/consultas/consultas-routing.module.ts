import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardsComponent } from '../../views/base/cards.component';
import { FormsComponent } from '../../views/base/forms.component';
import { SwitchesComponent } from '../../views/base/switches.component';
import { TablesComponent } from '../../views/base/tables.component';
import { ConsultasComponent } from './consultas.component';
import { CarouselsComponent } from '../../views/base/carousels.component';
import { CollapsesComponent } from '../../views/base/collapses.component';
import { PaginationsComponent } from '../../views/base/paginations.component';
import { PopoversComponent } from '../../views/base/popovers.component';
import { ProgressComponent } from '../../views/base/progress.component';
import { TooltipsComponent } from '../../views/base/tooltips.component';
import { NavbarsComponent } from '../../views/base/navbars/navbars.component';
import { planillaConsultaComponent } from '../../components/planillas/planilla_consulta.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base'
    },
    children: [
      {
        path: '',
        redirectTo: 'tabs'
      },
      {
        path: 'cards',
        component: CardsComponent,
        data: {
          title: 'Cards'
        }
      },
      {
        path: 'planillaconsulta/:uid',
        component: planillaConsultaComponent,
        data: {
          title: 'Consulta'
        }
      },
      {
        path: 'forms',
        component: FormsComponent,
        data: {
          title: 'Forms'
        }
      },
      {
        path: 'switches',
        component: SwitchesComponent,
        data: {
          title: 'Switches'
        }
      },
      {
        path: 'tables',
        component: TablesComponent,
        data: {
          title: 'Tables'
        }
      },
      {
        path: 'tabs',
        component: ConsultasComponent,
        data: {
          title: 'Tabs'
        }
      },
      {
        path: 'carousels',
        component: CarouselsComponent,
        data: {
          title: 'Carousels'
        }
      },
      {
        path: 'collapses',
        component: CollapsesComponent,
        data: {
          title: 'Collapses'
        }
      },
      {
        path: 'paginations',
        component: PaginationsComponent,
        data: {
          title: 'Pagination'
        }
      },
      {
        path: 'popovers',
        component: PopoversComponent,
        data: {
          title: 'Popover'
        }
      },
      {
        path: 'progress',
        component: ProgressComponent,
        data: {
          title: 'Progress'
        }
      },
      {
        path: 'tooltips',
        component: TooltipsComponent,
        data: {
          title: 'Tooltips'
        }
      },
      {
        path: 'navbars',
        component: NavbarsComponent,
        data: {
          title: 'Navbars'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultasRoutingModule {}
