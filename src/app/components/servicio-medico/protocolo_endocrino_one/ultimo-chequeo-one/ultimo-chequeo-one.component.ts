import { Component, OnChanges, Inject, LOCALE_ID, Input } from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
//import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

//modelos
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../../models/servicio-medico/varios.model';
import {  IEvaluaciones_PosibleResp, IEvaluaciones_endocrinas, IRespuestas_pacientes_eval_endocrino, IPosibles_resp_endocrinas } from '../../../../models/servicio-medico/protocolo_endocrino.model';

//servicios
import { ProtocolosEndocrinosService } from '../../../../services/servicio_medico/protocolo_endocrino.service'

@Component({
  selector: 'app-ultimo-chequeo-one',
  templateUrl: './ultimo-chequeo-one.component.html',
  styleUrls: ['./ultimo-chequeo-one.component.css'],
  providers: [  ProtocolosEndocrinosService, 
    { provide: AlertConfig }],
})
export class UltimoChequeoOneComponent implements OnChanges {

  constructor(     
    private router: Router,    
    private srvProtocolo: ProtocolosEndocrinosService,    
    @Inject(LOCALE_ID) public locale: string,
    
  ) { 
    this.llenarArrayEvaluacionesAll();
    this.llenarArrayPosiblesRespEndocrinasAll();
  }
  @Input() inIDPaciente :string;
  @Input() inIDProtocolo :string;
  @Input() nuevo :boolean;
  tipoIndice: number=4;
  bloqueaGuardar: boolean=true;
  arrayEvaluaciones: IEvaluaciones_PosibleResp[]=[ { evaluaciones: {}, posibles_resp: []} ];
  arrayEvaluacionesConRespuestas:  { evaluaciones?: IEvaluaciones_endocrinas, posibles_resp?: {
      idposibleresp?: number,
      fkevaluacion?: number,
      posible_resp?: boolean,
      observacion?: string,
      index?: number,
      } 
    }[] = [];
  arrayTiposEvaluciones: {tipoevaluacion: string, index: number, cantItem: number}[]=[];
  arrayRespuestas: IRespuestas_pacientes_eval_endocrino[]=[];
  arrayPosiblesRespEndocrinas: IPosibles_resp_endocrinas[]=[];
  
  private user: IUsuarios={};
  private tipoUser: string;
  alertaRegistrar: string="";
  titleRegistrar: string="";
  popover: Ipopover={} ;
  soloLectura: boolean;
  
  alertsDismiss: any = [];

  async ngOnChanges() {
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
    if (this.inIDPaciente!=undefined && this.inIDPaciente!="") {  
      //console.log(`idPaciente: ${this.inIDPaciente}, idProtocolo: ${this.inIDProtocolo}`);
      await this.llenarArrayRespuestas();
    }
    else{
      this.arrayEvaluacionesConRespuestas=[];
    }

    this.bloqueaGuardar = this.BloquearGuardar();       
  }
  
  BloquearGuardar(){
    let bloquear: boolean = false;
    if (this.inIDPaciente == undefined || this.inIDPaciente == ""){
      bloquear=true;
    }
    if (this.inIDProtocolo == undefined || this.inIDProtocolo==""){
      bloquear=true;
    } 
    return bloquear;
  }

  async llenarArrayEvaluacionesAll(){       
    await this.srvProtocolo.EvalPosiblesRespEndocrinasAll()
    .then(result => {
      if (result.length>0){
        this.arrayEvaluaciones = result.filter((e)=>{return e.evaluaciones.tipoindice==this.tipoIndice})         
      }
      else{
        this.arrayEvaluaciones=[];
      }        
    })       
  }

  async llenarArrayPosiblesRespEndocrinasAll(){    
    
    await this.srvProtocolo.posiblesRespEndocrinasAll()    
    .then(async result => {
      if (result[0]!= undefined){
        this.arrayPosiblesRespEndocrinas=result;  
      }
      else
        this.arrayPosiblesRespEndocrinas=[];      
    })       
  }

  async arrayPosiblesRespuestas(idevaluacion: number){    
    for await (let ev of this.arrayEvaluaciones){      
      if (ev.evaluaciones.idevaluacion==idevaluacion)
        return ev.posibles_resp
    }     
  }

  async getIdRespuesta(e: any, IdposiblesResp: number , i: number){    
    let posibleResp: IPosibles_resp_endocrinas[];
    const logica: string = e.target.checked ? 'SI' : 'NO';     
    posibleResp = await this.arrayPosiblesRespuestas(IdposiblesResp);
    this.arrayEvaluacionesConRespuestas[i].posibles_resp.idposibleresp = await this.buscarIDrespuesta(logica, posibleResp);
    this.bloqueaGuardar = this.BloquearGuardar();
    if (this.bloqueaGuardar){
      this.showSuccess('Debe Crear una Nueva Evaluacion (Pestaña: Datos Generales)', 'danger');
    }
  }

  async buscarIDrespuesta(posibleResp: string, arrayPosiblesResp: IPosibles_resp_endocrinas[]){
    let idPosibleResp: number = null;
    for await (let p of arrayPosiblesResp){
      if (p.posible_resp===posibleResp){
         idPosibleResp=p.idposibleresp
      }
    }
    return idPosibleResp;
  }

  async PosiblesRespEndocrinasID(idposibleResp: number){    
    for await (let pos of this.arrayPosiblesRespEndocrinas){
      if (pos.idposibleresp==idposibleResp)
        return pos;
    }     
  }

  async buscarRespuestasPaciente(idProtocolo: string){
    return await this.srvProtocolo.respuestasPacientesEvalEndocrino(this.inIDPaciente, idProtocolo);
  } 

  async llenarArrayRespuestas(){    
    this.arrayRespuestas=[];
    this.arrayEvaluacionesConRespuestas=[];
    let respuesta: {
      idposibleresp?: number,
      fkevaluacion?: number,
      posible_resp?: boolean,
      observacion?: string,
      index?: number,
    };
    
    let iDProtocolo: string='undefined';
    if (this.nuevo){
      iDProtocolo=this.inIDProtocolo;
    }else{
      let maxProtocolo = await this.srvProtocolo.ultimaEvaluacion(this.inIDPaciente, this.tipoIndice);      
      if (maxProtocolo.ultimoprotocolo>0)
        iDProtocolo = maxProtocolo.ultimoprotocolo.toString();
    }
    
    this.arrayRespuestas = await this.buscarRespuestasPaciente(iDProtocolo);
    
    let idResp:number;
    let posibleResp: IPosibles_resp_endocrinas[];

    if (this.arrayRespuestas.length>0){         
      
      for await (let eva of this.arrayEvaluaciones){
        posibleResp = await this.arrayPosiblesRespuestas(eva.evaluaciones.idevaluacion);
        idResp = await this.buscarIDrespuesta('NO', posibleResp);
        respuesta= {
          idposibleresp: idResp,
          fkevaluacion: null,
          posible_resp: false,
          observacion: '',
          index: null
        };
        for await (let pos of eva.posibles_resp) {
          for await (let resp of this.arrayRespuestas){
            if (resp.fkposible_resp==pos.idposibleresp){
              respuesta={
                idposibleresp: resp.fkposible_resp,
                fkevaluacion: eva.evaluaciones.idevaluacion,                
                observacion:  resp.respuesta == undefined || resp.respuesta == null ? '' : resp.respuesta,
                posible_resp: (await this.PosiblesRespEndocrinasID(resp.fkposible_resp)).posible_resp == 'SI' ? true : false ,
                index: eva.evaluaciones.indice,
              }                  
            }
          }                                
        }
        this.arrayEvaluacionesConRespuestas.push({evaluaciones:eva.evaluaciones, posibles_resp: respuesta });
      }
      
    }
    else{
      this.arrayRespuestas=[];
      for await (let eva of this.arrayEvaluaciones){
        posibleResp = await this.arrayPosiblesRespuestas(eva.evaluaciones.idevaluacion);
        idResp = await this.buscarIDrespuesta('NO', posibleResp);
        respuesta= {
          idposibleresp: idResp,
          fkevaluacion: eva.evaluaciones.idevaluacion,
          posible_resp: false,
          observacion: '',
          index: null
        };
        this.arrayEvaluacionesConRespuestas.push({evaluaciones:eva.evaluaciones, posibles_resp: respuesta });
      }
      
    }   
    
  }

  async guardar(){    
    let respuestasPaciente: IRespuestas_pacientes_eval_endocrino={};
    
    this.popover={};
    this.popover = await this.validaEntradas();

    if ( this.popover.alerta!=undefined){        
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo 
      return;
    }
    
    if (this.arrayRespuestas.length>0){
      await this.srvProtocolo.deleteRecordRespProtEndocrino(Number(this.inIDProtocolo), this.tipoIndice).toPromise();
    }

    let errorRegistro: boolean[] = [];

    for await (const eva of this.arrayEvaluacionesConRespuestas){
      respuestasPaciente={        
        fkprotocolo: Number(this.inIDProtocolo),
        fkpaciente: Number(this.inIDPaciente),
        fkposible_resp: eva.posibles_resp.idposibleresp,
        respuesta: eva.posibles_resp.observacion
      };
      
      await this.srvProtocolo.createRecordRespProtEndocrino(respuestasPaciente)
      .toPromise()
      .then(result =>{        
        if (result.idresp == undefined || typeof(result.idresp)!='number')
          errorRegistro.push(false);          
      })
      .catch(error =>{
        this.showSuccess(error, 'danger');
      });      
    }
    
    if (errorRegistro.indexOf(false)<0)
      this.showSuccess('Registrados satisfactoriamente', 'success');
    else   
      this.showSuccess('Error en el registros de las respuestas', 'danger');
  }

  reset(){
    //this.inIDProtocolo="";
    //this.inIDPaciente ="";
    this.llenarArrayRespuestas();
  }

  private async  validaEntradas(){
    let popOver: Ipopover={};
    console.log();
    
    if (this.inIDProtocolo == undefined || this.inIDProtocolo ==''){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe Crear una Nueva Evaluacion (Pestaña: Datos Generales)"
      };
      this.bloqueaGuardar=true;      
      return  popOver;
    }

    if (this.inIDPaciente == undefined || this.inIDPaciente ==''){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe Seleccionar un Paciente (Pestaña: Datos Generales)"
      };
      this.bloqueaGuardar=true;      
      return  popOver;
    }    

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