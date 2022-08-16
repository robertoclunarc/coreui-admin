//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
//import { ModalDirective} from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';

//servicios

//modelos
import { Ipopover } from '../../../models/servicio-medico/varios.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IvPaciente } from '../../../models/servicio-medico/paciente.model';

@Component({
  selector: 'app-historial',
  templateUrl: 'historial.component.html',
  providers: [ { provide: AlertConfig }],
  styleUrls: ["historial.component.css"]             
})
export class HistoriaMedicaComponent  implements OnInit  {  

  private user: IUsuarios={};
  private tipoUser: string;    
  itemsConsulta: number;
  itemCargos: number;
  itemAntecedentes: number;
  itemOcupaciones: number;
  itemExamenFuncionalA: number;
  itemExamenFuncionalB: number;
  itemAnamnesis: number;
  itemExamenFisico1: number;
  itemExamenFisico2: number;
  itemExamenFisico3: number;
  fechaIni='null';
  fechaFin='null';  
  paciente: IvPaciente={};
  uidPaciente: string;
  soloLectura: boolean=false;
  private alertsDismiss: any = [];  

  constructor(
    private router: Router, 
       
    @Inject(LOCALE_ID) public locale: string,  
    ) {  }

  ngOnInit(): void {}

  async buscarPaciente(e: IvPaciente){
    
    this.paciente=e;
    if (this.paciente.ci!="" && this.paciente.ci!= undefined && this.paciente.ci!= null){
      console.log(this.paciente);
      this.uidPaciente=this.paciente.uid_paciente.toString();
      
    } else {
      this.paciente={};
      this.uidPaciente="null";
    }   
  }
  
  ouputEmiterItemsConsulta(miVar:number){
    this.itemsConsulta= miVar;
  }

  outputEmiterItemsCargos(total:number){
    this.itemCargos=total;
  }

  outputEmiterItemsAntecedentes(total:number){
    this.itemAntecedentes=total;
  }

  outputEmiterItemsOcupaciones(total:number){
    this.itemOcupaciones=total;
  }

  outputEmiterItemsExamenFucional1(total:number){
    this.itemExamenFuncionalA=total;
  }

  outputEmiterItemsExamenFuncional2(total:number){
    this.itemExamenFuncionalB=total;
  }

  outputEmiterItemsAnamnesis(total:number){
    this.itemAnamnesis=total;
  }

  outputEmiterItemsFisico1(total:number){
    this.itemExamenFisico1=total;
  }

  outputEmiterItemsFisico2(total:number){
    this.itemExamenFisico2=total;
  }

  outputEmiterItemsFisico3(total:number){
    this.itemExamenFisico3=total;
  }
 
}