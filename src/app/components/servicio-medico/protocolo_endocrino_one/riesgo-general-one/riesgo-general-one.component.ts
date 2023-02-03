import { Component, OnChanges, Inject, LOCALE_ID, Output, Input, EventEmitter, NgModule} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeaheadMatch} from 'ngx-bootstrap/typeahead';

//modelos
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../../models/servicio-medico/varios.model';
import { IProtocolosEndrocrinos, IEvaluaciones_PosibleResp, IEvaluaciones_endocrinas, IRespuestas_pacientes_eval_endocrino } from '../../../../models/servicio-medico/protocolo_endocrino.model';

//servicios

import { ProtocolosEndocrinosService } from '../../../../services/servicio_medico/protocolo_endocrino.service'


@Component({
  selector: 'app-riesgo-general-one',
  templateUrl: './riesgo-general-one.component.html',
  styleUrls: ['./riesgo-general-one.component.css'],
  providers: [  ProtocolosEndocrinosService, 
    { provide: AlertConfig }],
})
export class RiesgoGeneralOneComponent implements OnChanges {

  constructor( 
    private route: ActivatedRoute,  
    private router: Router,    
    private srvProtocolo: ProtocolosEndocrinosService,    
    @Inject(LOCALE_ID) public locale: string,
    
  ) { 
    
    this.llenarArrayEvaluacionesAll()
  }

  //@Output() outProtocolo = new EventEmitter<IvProtocoloEndrocrinos>();
  @Input() inProtocolo :string;
  //@Input() idProtocolo: number = 0;  
  
  protocoloObj: IProtocolosEndrocrinos={}; 
  arrayEvaluaciones: IEvaluaciones_PosibleResp[]=[ { evaluaciones: {}, posibles_resp: []} ];
  arrayTiposEvaluciones: {tipoevaluacion: string, index: number, cantItem: number}[]=[];
  arrayRespuestas: IRespuestas_pacientes_eval_endocrino[]=[];
  
  private user: IUsuarios={};
  private tipoUser: string; 
  alertaRegistrar: string=""; 
  titleRegistrar: string="";
  popover: Ipopover={} ;
  soloLectura: boolean;
  
  arrayFrecuenciaRotacion= [
    {valor: 'Indeterminada', display: 'Indeterminada'},
    {valor: 'Diaria', display: 'Diaria'},
    {valor: 'Semanal', display: 'Semanal'},
    {valor: 'Mensual', display: 'Mensual'},
    {valor: 'Trimestral', display: 'Semestral'},
    {valor: 'Anual', display: 'Anual'}    
  ];
  
  alertsDismiss: any = [];

  ngOnChanges(): void {
    if (sessionStorage.currentUser){  

      this.user=JSON.parse(sessionStorage.currentUser);
      if (this.user) {
           
        this.tipoUser= sessionStorage.tipoUser;
      }
      else {
            this.router.navigate(["login"]);
      }
    }else{
      this.router.navigate(["login"]);
    }

    if (this.tipoUser=='MEDICO' || this.tipoUser=='SISTEMA' || this.tipoUser=='ADMPERSONAL'){
      this.soloLectura=false;
    }
    else{
      this.soloLectura=true;
    }   
    
    if (this.inProtocolo){
      this.protocoloObj=JSON.parse(this.inProtocolo);
      
    }
    console.log(this.protocoloObj);
  }  
  
  async llenarArrayEvaluaciones(){    
    
    await this.srvProtocolo.evaluacionesEndocrinasAllxTipo()    
    .then(async result => {
      if (result[0]!= undefined){
        this.arrayTiposEvaluciones=result;  
      }
      else
        this.arrayTiposEvaluciones=[];      
    })       
  }

  async llenarArrayEvaluacionesAll(){    
    
    await this.srvProtocolo.EvalPosiblesRespEndocrinasAll()
    .then(async result => {
      if (result.length>0){
        this.arrayEvaluaciones = result.filter((e)=>{return e.evaluaciones.tipoindice==1})      
        console.log(this.arrayEvaluaciones);
        for (let eva of this.arrayEvaluaciones){
            for (const [i, value] of eva.posibles_resp.entries()) {
                this.arrayRespuestas[i].fkposible_resp=value.idposibleresp;
                this.arrayRespuestas[i].fkpaciente=this.protocoloObj.fkpaciente;                
            }            
        }
        console.log(this.arrayRespuestas); 
      }
      else
        this.arrayEvaluaciones=[];
        
    })       
  }

  private async nuevoProtocolo(idProtocolo: number){ 
    /*let evaluacion: IRespuestas_pacientes_eval_endocrino={};
    await this.srvProtocolo.deleteRecordRespProtEndocrino(idProtocolo).toPromise();
    for await (let eva of this.arrayEvaluaciones){
      if (eva.evaluaciones.descripcion_evaluacion!=undefined && eva.evaluaciones.descripcion_evaluacion!="") { 
        evaluacion={
            
            fkprotocolo: eva.posibles_resp
            fkpaciente: number;
            fkposible_resp: number;
            respuesta: string;
        }
      
        await this.srvHabitos.registrar(this.habitoPaciente)
        .toPromise()
        .then( result  => {
          if (result){
            this.saved=true;
            
          }else{
            this.saved=false;
            this.showSuccess('Error en el registro del habito del paciente: ' + hab.resp, 'danger'); 
            return;
          }      
        })
      }
    }  */
  }

  async guardar(){    
    let objProtocolo: IProtocolosEndrocrinos={};
    this.popover={};    

    this.popover = await this.validaEntradas();

    if ( this.popover.alerta!=undefined){        
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo 
      return;
    }    
    
    /*
    if (this.protocoloObj.protocolo.vigencia!=undefined)
      this.protocoloObj.protocolo.vigencia=formatDate(this.protocoloObj.protocolo.vigencia, 'yyyy-MM-dd HH:mm:ss', this.locale);
    
    */   
    
    /*
    if (this.protocoloObj.protocolo.idprotocolo!=undefined){
      await this.srvProtocolo.updateRecordProtocoloEndocrino(objProtocolo).toPromise();
      this.showSuccess('Registros actualizados satisfactoriamente', 'success');
    }else{      
      
      await this.srvProtocolo.createRecordProtocoloEndocrino(objProtocolo).toPromise()
      objProtocolo.idprotocolo= this.srvProtocolo.protocolo.idprotocolo;
      this.protocoloObj.protocolo.idprotocolo=objProtocolo.idprotocolo
      if (objProtocolo.idprotocolo)
        this.showSuccess('Datos registrados satisfactoriamente', 'success');
      else
        this.showSuccess('Error en el registro del paciente', 'danger'); 
    }
    */
    
  }

  reset(){
    this.protocoloObj={};
    //this.outProtocolo.emit(this.protocoloObj);
    
  }

  private async  validaEntradas(){
    let popOver: Ipopover={};
    console.log()
    /*
    if (this.protocoloObj.paciente.ci == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la cedula de identidad del paciente"
      };      
      return  popOver;
    }

    if (this.protocoloObj.paciente.nombre_completo == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el nombre del paciente"
      };      
      return  popOver;
    }    

    if (this.protocoloObj.medico.uid == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el medico evaluador"
      };      
      return  popOver;
    }

    if (this.protocoloObj.protocolo.emision == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "debe especifica la fecha de emision"
      };      
      return  popOver;
    }
    */

    return  popOver;
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }

  showSuccess(mensaje: string, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
  }

}
