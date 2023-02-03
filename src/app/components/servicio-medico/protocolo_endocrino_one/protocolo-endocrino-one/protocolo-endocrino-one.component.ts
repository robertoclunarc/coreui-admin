import { Component, OnChanges, Inject, LOCALE_ID, Output, Input, EventEmitter, NgModule} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeaheadMatch} from 'ngx-bootstrap/typeahead';

//modelos

import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../../models/servicio-medico/varios.model';
import { IvProtocoloEndrocrinos, IProtocolosEndrocrinos, IPosibles_resp_endocrinas, } from '../../../../models/servicio-medico/protocolo_endocrino.model';
import { IMedicos } from '../../../../models/servicio-medico/medicos.model'

//servicios
import { PacientesService } from '../../../../services/servicio_medico/pacientes.service';
import { ProtocolosEndocrinosService } from '../../../../services/servicio_medico/protocolo_endocrino.service'
import { MedicosService } from '../../../../services/servicio_medico/medicos.service';

@Component({
  selector: 'app-protocolo-endocrino-one',
  templateUrl: './protocolo-endocrino-one.component.html',
  styleUrls: ['./protocolo-endocrino-one.component.css'],
  providers: [ PacientesService, MedicosService, ProtocolosEndocrinosService, 
    { provide: AlertConfig }],
})
export class protocoloEndocrinoOneComponent implements OnChanges {

  constructor( 
    private route: ActivatedRoute,  
    private router: Router,
    private srvPacientes: PacientesService, 
    private srvProtocolo: ProtocolosEndocrinosService,
    private srvMedicos: MedicosService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { 
    this.llenarArrayMedico();   
  }

  //@Output() outProtocolo = new EventEmitter<IvProtocoloEndrocrinos>();
  @Input() inProtocolo :string;
  //@Input() idProtocolo: number = 0;  
  
  protocoloObj: IvProtocoloEndrocrinos={ paciente: {}, medico: {}, protocolo:{} };   
  selectMedicos: IMedicos[]=[];
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
      this.protocoloObj.protocolo.emision= formatDate(this.protocoloObj.protocolo.emision, 'yyyy-MM-dd', this.locale);
      this.protocoloObj.protocolo.emision= formatDate(this.protocoloObj.protocolo.vigencia, 'yyyy-MM-dd', this.locale);
      this.protocoloObj.protocolo.emision= formatDate(this.protocoloObj.protocolo.proxima_cita, 'yyyy-MM-dd', this.locale)
    }
    
  }

  async buscarPaciente(){    
    
      await this.srvPacientes.pacienteOne(this.protocoloObj.paciente.ci)
      .toPromise()
      .then(async result => {
        if (result[0]!= undefined){
          this.protocoloObj.paciente=result[0];
          this.protocoloObj.protocolo.lugar="PUERTO ORDAZ"
          
          this.protocoloObj.protocolo.emision= formatDate(Date.now(), 'yyyy-MM-dd', this.locale)
          
         // this.outProtocolo.emit(protocoloObj);
          
        }
        else
          this.protocoloObj.paciente={} 
        
      })       
  }

  private llenarArrayMedico(){
    this.srvMedicos.medicosAll()
    .toPromise()
    .then(result => {
      if (result){ 
        this.selectMedicos=result;
      }
    })
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

    objProtocolo={      
      fkpaciente:this.protocoloObj.paciente.uid_paciente,
      emision:formatDate(this.protocoloObj.protocolo.emision, 'yyyy-MM-dd HH:mm:ss', this.locale),
      referecia: this.protocoloObj.protocolo.referecia,
      charla: this.protocoloObj.protocolo.charla,
      boletin: this.protocoloObj.protocolo.boletin,
      folleto: this.protocoloObj.protocolo.folleto,
      otro: this.protocoloObj.protocolo.otro,
      indicaciones: this.protocoloObj.protocolo.indicaciones,
      fkmedico: this.protocoloObj.medico.uid,
      diagnostico: this.protocoloObj.protocolo.diagnostico,
      lugar: this.protocoloObj.protocolo.lugar,
      
    };
    
    if (this.protocoloObj.protocolo.vigencia!=undefined)
      this.protocoloObj.protocolo.vigencia=formatDate(this.protocoloObj.protocolo.vigencia, 'yyyy-MM-dd HH:mm:ss', this.locale);
    
    if (this.protocoloObj.protocolo.proxima_cita!=undefined)
      this.protocoloObj.protocolo.proxima_cita=formatDate(this.protocoloObj.protocolo.proxima_cita, 'yyyy-MM-dd HH:mm:ss', this.locale);    
    
    if (this.protocoloObj.protocolo.idprotocolo!=undefined){
      console.log(this.protocoloObj);
      objProtocolo.idprotocolo=this.protocoloObj.protocolo.idprotocolo;
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
    
  }

  reset(){
    this.protocoloObj={};
    //this.outProtocolo.emit(this.protocoloObj);
    
  }

  private async  validaEntradas(){
    let popOver: Ipopover={};
    console.log()
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
