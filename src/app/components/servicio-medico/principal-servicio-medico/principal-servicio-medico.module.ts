import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';
import { PrincipalServicioMedicoComponent } from './principal-servicio-medico.component';
import { PrincipalServicioMedicoRouting } from './principal-servicio-medico.routing';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PrincipalServicioMedicoRouting,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot()
  ],
  declarations: [ PrincipalServicioMedicoComponent ]
})
export class DashboardModule { }
