//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
//import { ModalDirective} from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';

//servicios
import { HistoriaService } from '../../../services/servicio_medico/historias.service';

//modelos

import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IvPaciente } from '../../../models/servicio-medico/paciente.model';
import { IHistoria_medica, IHistoria_paciente } from '../../../models/servicio-medico/historias.model'
import { MedicosService } from '../../../services/servicio_medico/medicos.service';
import { IMedicos } from '../../../models/servicio-medico/medicos.model';

@Component({
  selector: 'app-historial',
  templateUrl: 'historial.component.html',
  providers: [ { provide: AlertConfig }, HistoriaService],
  styleUrls: ["historial.component.css"]             
})
export class HistoriaMedicaComponent  implements OnInit  {  
  
  private user: IUsuarios={};
  private tipoUser: string;    
  itemsConsulta: number;
  itemCargos: number;
  itemCargosOtras: number;
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
  historiaMedica: IHistoria_medica={};
  medicoTutular: IMedicos={};
  private nuevo: boolean = false;
  paciente: IvPaciente={};
  uidPaciente: string;
  soloLectura: boolean=false;
  alertsDismiss: any = [];  
  modal: string="";
  constructor(
    private router: Router, 
    private srvHistorias: HistoriaService, 
    private srvMedicos: MedicosService,  
    @Inject(LOCALE_ID) public locale: string,  
    ) {  }

  async ngOnInit() {
    if (sessionStorage.currentUser){
      this.user=JSON.parse(sessionStorage.currentUser);
      if (this.user) { 
        this.tipoUser= sessionStorage.tipoUser;
      }
      else {
        this.router.navigate(["serviciomedico/login"]);
      }
    }else{
      this.router.navigate(["serviciomedico/login"]);
    }
    this.medicoTutular = await this.srvMedicos.medicoTitular();
  }

  async buscarPaciente(e: IvPaciente){
    this.historiaMedica={};
    this.paciente=e;
    if (this.paciente.ci!="" && this.paciente.ci!= undefined && this.paciente.ci!= null){      
      this.uidPaciente=this.paciente.uid_paciente.toString();
      this.buscarHistoriaPaciente('null', this.uidPaciente)
    } else {
      this.paciente={};
      this.uidPaciente="null";
    }   
  }

  async buscarHistoriaPaciente(uidHist: string, idpaciente: string){    
    if ( idpaciente!= undefined){
      await this.srvHistorias.historiaMedicaOne(uidHist, idpaciente.toString())
      .toPromise()
      .then((result) => {
        if (result){
          this.historiaMedica=result;          
          this.nuevo=false;
        }
        else{
          this.historiaMedica={};
          this.nuevo=true;
        }  
      })      
    }
  }

  async registrar(){
    let mensaje: any;
    if (this.historiaMedica.fecha_accidente==null || this.historiaMedica.fecha_accidente==undefined || this.historiaMedica.fecha_accidente=="")
      this.historiaMedica.fecha_accidente=null;
    else  
      this.historiaMedica.fecha_accidente= formatDate(this.historiaMedica.fecha_accidente, 'yyyy-MM-dd', this.locale);
    
    if (this.nuevo){
      this.historiaMedica.uid_paciente = this.paciente.uid_paciente;
      this.historiaMedica.fecha_apertura= formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
      this.historiaMedica.fk_medico = this.medicoTutular.uid;
      await this.srvHistorias.nuevoHistoriaHistoriaMedica(this.historiaMedica)
      .then(result => {
        if (result.uid_historia!=undefined){
          this.showSuccess('Registro Almacenado Correctamente', 'success');
        }
        else{
          this.showSuccess( result , 'danger');
        }
      })
    }
    else{
     
      this.historiaMedica.fecha_apertura= formatDate(this.historiaMedica.fecha_apertura, 'yyyy-MM-dd HH:mm:ss', this.locale),
      this.historiaMedica.fecha_ultima_actualizacion= formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
      mensaje=await this.srvHistorias.updateHistoriaMedica(this.historiaMedica).toPromise();
      this.showSuccess(mensaje, 'success');
    }    
    
  }

  showSuccess(mensaje: any, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }
  
  ouputEmiterItemsConsulta(miVar:number){
    this.itemsConsulta= miVar;
  }

  outputEmiterItemsCargos(total:number){
    this.itemCargos=total;
  }

  outputEmiterItemsCargosOtras(total:number){
    this.itemCargosOtras=total;
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