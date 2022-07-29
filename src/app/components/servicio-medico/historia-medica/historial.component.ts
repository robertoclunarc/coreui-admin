//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
//import { ModalDirective} from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';

//servicios

import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

//modelos
import { Ipopover } from '../../../models/servicio-medico/varios.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IPaciente } from '../../../models/servicio-medico/paciente.model';

@Component({
  selector: 'app-historial',
  templateUrl: 'historial.component.html',
  providers: [ PacientesService,   { provide: AlertConfig }],
  styleUrls: ["historial.component.css"]             
})
export class HistoriaMedicaComponent  implements OnInit  {  

  private user: IUsuarios={};
  private tipoUser: string;    
  
  fechaIni='null';
  fechaFin='null';  
  paciente: IPaciente={};
  uidPaciente: string;
  soloLectura: boolean=false;
  private alertsDismiss: any = [];  

  constructor(
    private router: Router, 
    private srvPacientes: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,  
    ) {  }

  ngOnInit(): void {}

  async buscarPaciente(e){
    console.log(e);
    this.paciente.ci=e;
    if (this.paciente.ci!="" && this.paciente.ci!= undefined && this.paciente.ci!= null){
      await this.srvPacientes.pacienteOne(this.paciente.ci)
      .toPromise()
      .then(result => {
        if (result[0]!= undefined){
          this.paciente=result[0];
          this.paciente.fechanac= formatDate(this.paciente.fechanac, 'yyyy-MM-dd', 'en');
          this.paciente.fecha_ingreso=formatDate(this.paciente.fecha_ingreso, 'yyyy-MM-dd', 'en');
          this.paciente.antiguedad_puesto=formatDate(this.paciente.antiguedad_puesto, 'yyyy-MM-dd', 'en');
          this.uidPaciente=this.paciente.uid_paciente.toString();          
          
        }
        else{
          this.paciente={};
          this.uidPaciente= "null";        }
        
      })
    } else {
      this.paciente={};
      this.uidPaciente="null";
    }   
  } 
 
}