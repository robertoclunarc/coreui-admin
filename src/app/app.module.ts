import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgbToastModule } from  'ngb-toast';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { authInterceptorProviders } from "../app/helpers/login.interceptor";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';
import { LayoutServicioMedicoComponent } from './containers/layout-serviciomedico';
import { LayoutBalanzaComponent } from './containers/layout-balanza';

//eliminar despues de terminar historial medico:
import { PacientesComponent } from './components/servicio-medico/pacientes/pacientes.component';
import { CargosAnterioresComponent } from './components/servicio-medico/cargos_anteriores/cargos_anteriores.component';
import { AntecedenteFamiliarComponent } from './components/servicio-medico/antecedentes_familiares/antecedentefamiliar.component';
///////////////////////////////////////////////

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';

import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent, LayoutServicioMedicoComponent, LayoutBalanzaComponent , PacientesComponent, CargosAnterioresComponent, AntecedenteFamiliarComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
  
  
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';

import { LoginServicioMedicoComponent } from './components/servicio-medico/login-servicio-medico/login-servicio-medico.component';
import { LoginBalanzaComponent } from './components/balanza/login-balanza/login-balanza.component';
//import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    HttpClientModule,
    FormsModule,
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
   //BsDropdownModule,    
   //ButtonsModule.forRoot(),
    NgbToastModule,    
    
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,    
    RegisterComponent, 
    LoginServicioMedicoComponent,
    LoginBalanzaComponent,
  ],
  /*providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    
  ],*/
  providers: [authInterceptorProviders],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
 