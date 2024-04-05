import { BrowserModule } from '@angular/platform-browser';
import { NgModule/*, APP_INITIALIZER*/ , LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
//import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgbToastModule } from  'ngb-toast';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { authInterceptorProviders } from "../app/helpers/login.interceptor";
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';

/*const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};*/

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';
import { LayoutServicioMedicoComponent } from './containers/layout-serviciomedico';
import { LoginServicioMedicoComponent } from './components/servicio-medico/login-servicio-medico/login-servicio-medico.component';
import { SolicitudComponent } from './components/servicio-medico/solicitudes_asistencias/solicitud-one/solicitud.component';

///////////////////////////////////////////////

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent, LayoutServicioMedicoComponent ,   
  SolicitudComponent,
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
import { ButtonsModule } from 'ngx-bootstrap/buttons';

//import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image';
import { registerLocaleData } from '@angular/common';
import localeEsVE from '@angular/common/locales/es-VE';

registerLocaleData(localeEsVE);

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
    CollapseModule.forRoot(),
    ChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    HttpClientModule,
    FormsModule,
    PaginationModule.forRoot(),
    TypeaheadModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule,    
    ButtonsModule.forRoot(),
    NgbToastModule,
    //LazyLoadImageModule
  ],
  
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,    
    RegisterComponent, 
    LoginServicioMedicoComponent,
  ],
  /* 
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    IconSetService,
    
  ],*/
  
  providers: [authInterceptorProviders, { provide: LOCALE_ID, useValue: 'es-VE' }],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
 