import { Component, OnChanges, Inject, LOCALE_ID, Input } from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
//import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

//modelos
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../../models/servicio-medico/varios.model';
import {  IEvaluaciones_PosibleResp, IEvaluaciones_endocrinas, IRespuestas_pacientes_eval_endocrino, IPosibles_resp_endocrinas, Irespuesta } from '../../../../models/servicio-medico/protocolo_endocrino.model';

//servicios
import { ProtocolosEndocrinosService } from '../../../../services/servicio_medico/protocolo_endocrino.service';
import { AntropometriaService } from '../../../../services/servicio_medico/antropometria.service';

@Component({
  selector: 'app-examen-fisico-one',
  templateUrl: './examen-fisico-one.component.html',
  styleUrls: ['./examen-fisico-one.component.css'],
  providers: [  ProtocolosEndocrinosService, 
    { provide: AlertConfig }],
})
export class ExamenFisicoOneComponent implements OnChanges {

  constructor(     
    private router: Router,    
    private srvProtocolo: ProtocolosEndocrinosService,
    private srvAntropometria: AntropometriaService,
    @Inject(LOCALE_ID) public locale: string,
    
  ) { 
    this.llenarArrayEvaluacionesAll();
    this.llenarArrayPosiblesRespEndocrinasAll();
  }
  @Input() inIDPaciente :string;
  @Input() inIDProtocolo :string;
  @Input() nuevo :boolean;
  tipoIndice: number=5;
  bloqueaGuardar: boolean=true;
  arrayEvaluaciones: IEvaluaciones_PosibleResp[]=[ { evaluaciones: {}, posibles_resp: []} ];
  arrayEvaluacionesConRespuestas:  { evaluaciones?: IEvaluaciones_endocrinas, posibles_resp?: {
      idposibleresp?: number,
      fkevaluacion?: number,
      descripcion?: string,
      posible_resp?: string,      
      index?: number,
      }[]
    }[] = [];
  respuestas: { marcada: Irespuesta[]} []=[];  
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
      else{
        this.arrayPosiblesRespEndocrinas=[];
      }
      
    })       
  }

  async arrayPosiblesRespuestas(idevaluacion: number){    
    for await (let ev of this.arrayEvaluaciones){      
      if (ev.evaluaciones.idevaluacion==idevaluacion)
        return ev.posibles_resp
    }     
  }

  async getIdRespuesta(e: any, resp: Irespuesta[] , i: number, j: number){    
    const logica: string = e.target.checked ? 'SI' : 'NO';
    const posNo = resp.map(p => p.descripcion).indexOf('NO');
    const posSi = resp.map(p => p.descripcion).indexOf('SI');
    let posDef: number;
    console.log(`No: ${posNo}; Si: ${posSi};`);
    console.log(`i: ${i}; j: ${j}; e: ${e.target.checked}`);
    console.log(resp);

    console.log(this.arrayEvaluacionesConRespuestas[i]);
    if (logica == 'SI'){
        this.respuestas[i].marcada[posSi].posible_resp=true;
        this.respuestas[i].marcada[posNo].posible_resp=false;
        posDef=posSi;
        this.arrayEvaluacionesConRespuestas[i].posibles_resp[posSi]= {
            posible_resp: logica,
            fkevaluacion: resp[posSi].fkevaluacion,
            descripcion: resp[posSi].descripcion,
            idposibleresp: resp[posSi].idposibleresp,
            index: resp[posSi].index,
        };
        this.arrayEvaluacionesConRespuestas[i].posibles_resp[posNo]= {
            posible_resp: '',
            fkevaluacion: resp[posNo].fkevaluacion,
            descripcion: resp[posNo].descripcion,
            idposibleresp: resp[posNo].idposibleresp,
            index: resp[posNo].index,
        };
    }else{
        this.respuestas[i].marcada[posSi].posible_resp=false;
        this.respuestas[i].marcada[posNo].posible_resp=true;
        posDef=posNo;
        this.arrayEvaluacionesConRespuestas[i].posibles_resp[posSi]= {
            posible_resp: '',
            fkevaluacion: resp[posSi].fkevaluacion,
            descripcion: resp[posSi].descripcion,
            idposibleresp: resp[posSi].idposibleresp,
            index: resp[posSi].index,
        };
        this.arrayEvaluacionesConRespuestas[i].posibles_resp[posNo]= {
            posible_resp: logica,
            fkevaluacion: resp[posNo].fkevaluacion,
            descripcion: resp[posNo].descripcion,
            idposibleresp: resp[posNo].idposibleresp,
            index: resp[posNo].index,
        };
    }
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

  async respuestasDelPaciente(idposibleResp: number){ 
    let respuesta: IRespuestas_pacientes_eval_endocrino={};   
    for await (let res of this.arrayRespuestas){
      if (res.fkposible_resp==idposibleResp){
        respuesta = res;
        break;
      }
    }
    return respuesta;    
  }

  async buscarRespuestasPaciente(idProtocolo: string){
    return await this.srvProtocolo.respuestasPacientesEvalEndocrino(this.inIDPaciente, idProtocolo, this.tipoIndice);
  }
  
  calc_imc(i: number, j: number, resp: any[]){    
    const indTalla = resp.map(p => p.descripcion).indexOf('Talla');
    const indPeso = resp.map(p => p.descripcion).indexOf('Peso');
    const indImc = resp.map(p => p.descripcion).indexOf('IMC');
    const talla = Number(this.arrayEvaluacionesConRespuestas[i].posibles_resp[indTalla].posible_resp);
    const peso = Number(this.arrayEvaluacionesConRespuestas[i].posibles_resp[indPeso].posible_resp);    
    const imc =  this.srvAntropometria.calculoImc(talla, peso);    
    this.arrayEvaluacionesConRespuestas[i].posibles_resp[indImc].posible_resp = imc;
  }

  async llenarArrayRespuestas(){    
    this.arrayRespuestas=[];
    this.arrayEvaluacionesConRespuestas=[];
    let respuesta: {
      idposibleresp?: number,
      fkevaluacion?: number,
      descripcion?: string,
      posible_resp?: string,      
      index?: number,
    }[];
    
    let iDProtocolo: string='undefined';
    if (this.nuevo){
      iDProtocolo=this.inIDProtocolo;
    }else{
      let maxProtocolo = await this.srvProtocolo.ultimaEvaluacion(this.inIDPaciente, this.tipoIndice);      
      if (maxProtocolo.ultimoprotocolo>0)
        iDProtocolo = maxProtocolo.ultimoprotocolo.toString();
    }
    
    this.arrayRespuestas = await this.buscarRespuestasPaciente(iDProtocolo);
    let marcada: Irespuesta[]=[];    
    let res: any;
    let sino: any;
    let idsino: any; 
    if (this.arrayRespuestas.length>0){      
      for await (let eva of this.arrayEvaluaciones){        
        respuesta=[];
        marcada=[];
        for await (let pos of eva.posibles_resp) {          
          for await (let resp of this.arrayRespuestas){                        
            if (resp.fkposible_resp==pos.idposibleresp){
              respuesta.push({
                idposibleresp: resp.fkposible_resp,
                fkevaluacion: eva.evaluaciones.idevaluacion,
                posible_resp: resp.respuesta,
                descripcion: pos.posible_resp,
                index: eva.evaluaciones.indice,
              });
              marcada.push({
                idposibleresp: resp.fkposible_resp,
                fkevaluacion: eva.evaluaciones.idevaluacion,
                descripcion:pos.posible_resp,
                posible_resp: resp.respuesta == pos.posible_resp ? true : ( resp.respuesta != '' ? true : false ),
                index: eva.evaluaciones.indice,
              });
              if (resp.respuesta=='NO' || resp.respuesta=='SI'){
                sino = resp.respuesta=='NO' ? 'SI' : 'NO';
                idsino = await this.buscarIDrespuesta(sino, eva.posibles_resp);
                respuesta.push({
                  idposibleresp: idsino,
                  fkevaluacion: eva.evaluaciones.idevaluacion,
                  posible_resp: '',
                  descripcion: sino,
                  index: eva.evaluaciones.indice,
                });
                marcada.push({
                  idposibleresp:  idsino,
                  fkevaluacion: eva.evaluaciones.idevaluacion,
                  descripcion:pos.posible_resp,
                  posible_resp: false,
                  index: eva.evaluaciones.indice,
                });
              }
            }            
          }
          res={};
          if (pos.posible_resp == "Observacion"){
            res = await  this.respuestasDelPaciente(pos.idposibleresp);
            if (res.respuesta==undefined){
              respuesta.push({
                idposibleresp: pos.idposibleresp,
                fkevaluacion: eva.evaluaciones.idevaluacion,
                posible_resp: '',
                descripcion: pos.posible_resp,
                index: eva.evaluaciones.indice,
              });
              marcada.push({
                idposibleresp: pos.idposibleresp,
                fkevaluacion: eva.evaluaciones.idevaluacion,
                descripcion: pos.posible_resp,
                posible_resp: false,
                index: eva.evaluaciones.indice,
              });
            }
          }
        }
        eva.evaluaciones.descripcion_evaluacion=eva.evaluaciones.descripcion_evaluacion.trim();
        this.arrayEvaluacionesConRespuestas.push({evaluaciones:eva.evaluaciones, posibles_resp: respuesta });
        this.respuestas.push({marcada: marcada });
      }
      
    }
    else{
      this.arrayRespuestas=[];
      this.respuestas = [];      
      for await (let eva of this.arrayEvaluaciones){
        console.log(eva);        
        respuesta=[];
        marcada=[];
        for await (let r of eva.posibles_resp){
            respuesta?.push({
                idposibleresp: r.idposibleresp,
                fkevaluacion: eva.evaluaciones.idevaluacion,
                descripcion: r.posible_resp,
                posible_resp: r.posible_resp=='NO' ? 'NO' : '',
                index: r.index
            });

            marcada.push({
                idposibleresp: r.idposibleresp,
                fkevaluacion: eva.evaluaciones.idevaluacion,
                descripcion: r.posible_resp,
                posible_resp: false,
                index: r.index
            });
        }
        eva.evaluaciones.descripcion_evaluacion=eva.evaluaciones.descripcion_evaluacion.trim();
        this.arrayEvaluacionesConRespuestas.push({evaluaciones:eva.evaluaciones, posibles_resp: respuesta });

        this.respuestas.push({marcada: marcada });
      }
      
    }   
    console.log(this.arrayEvaluacionesConRespuestas)
  }

  async guardar(){    
    let respuestasPaciente: IRespuestas_pacientes_eval_endocrino;
    
    this.popover={};
    this.popover = await this.validaEntradas();

    if ( this.popover.alerta!=undefined){        
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo 
      return;
    }
    this.bloqueaGuardar = true;
    if (this.arrayRespuestas.length>0){
      await this.srvProtocolo.deleteRecordRespProtEndocrino(Number(this.inIDProtocolo),this.tipoIndice).toPromise();
    }

    let errorRegistro: boolean[] = [];
    
    for await (const eva of this.arrayEvaluacionesConRespuestas){
        respuestasPaciente={};        
        for await (const res of eva.posibles_resp){
          console.log(res);
          if (res.posible_resp!=''){
            respuestasPaciente={
                fkprotocolo: Number(this.inIDProtocolo),
                fkpaciente: Number(this.inIDPaciente),
                fkposible_resp: res.idposibleresp,
                respuesta: res.posible_resp
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
        }
    }
    this.bloqueaGuardar = false;
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

    let eva: any;
    let res: any;    
    for (let i=0; i<this.arrayEvaluacionesConRespuestas.length; i++){
      eva=this.arrayEvaluacionesConRespuestas[i];
      if (eva?.posibles_resp!=undefined){
        for (let j=0; j<eva.posibles_resp.length; j++){
          res=eva.posibles_resp[j];
          if (res.descripcion!='Observacion' && res.posible_resp==''){
            if (res.descripcion!='SI' && res.descripcion!='NO'){
              this.arrayEvaluacionesConRespuestas[i].posibles_resp[j].posible_resp='-';            
            }
          }  
        }
      }  
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