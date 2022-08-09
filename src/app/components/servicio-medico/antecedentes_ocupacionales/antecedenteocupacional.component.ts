import { Component, ViewChild, OnChanges, Input , Inject, LOCALE_ID, NgModule, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { IRiesgos } from '../../../models/servicio-medico/riesgos.model';
import { IRiesgosHistoria, IRiesgosHistorias } from '../../../models/servicio-medico/historiamedica.model'
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { AntecedentesOcupacionalesService } from '../../../services/servicio_medico/antecedentesocupacionales.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

@Component({
  selector: 'app-antecedenteocupacional',
  templateUrl: './antecedenteocupacional.component.html',
  styleUrls: ['./antecedenteocupacional.component.css'],
  providers: [ PacientesService,
    { provide: AlertConfig }],
})
export class AntecedenteOcupacionalComponent implements OnChanges {

  @Input() _uidPaciente: string;
  @ViewChild('cboRiesgos') cboRiesgos!: ElementRef<HTMLInputElement>;  
  @ViewChild('txtResp') txtResp!: ElementRef<HTMLInputElement>;
  @ViewChild('cboTiempoExposicion') cboTiempoExposicion!: ElementRef<HTMLInputElement>; 
  
  constructor( 
    
    private route: ActivatedRoute,  
    private router: Router,
    private srvAntecedentesOcupacionales: AntecedentesOcupacionalesService,
    private srvPaciente: PacientesService,    
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  private uidPaciente: number;
  private cedula: string;
  tiempo: string;
  periodo: string;
  agenteSelect: string=null;
  antecedentesOcupacionales: IRiesgosHistorias[]=[]; 
  antecedenteOcupacional: IRiesgosHistoria={};
  ArrayAgentes: [{agente: string}]; 
  ArrayExposiciones: IRiesgos[]=[]; 
  private user: IUsuarios={};
  private tipoUser: string; 
  private alertaRegistrar: string; 
  private titleRegistrar: string;
  private popover: Ipopover={} ;
  private soloLectura: boolean;
  arrayPeriodos=[
    {label: 'Año(s)', value:'Año(s)'},
    {label: 'Mes(es)', value:'Mes(es)'},
    {label: 'Dia(s)', value:'Dia(s)'},    
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

    
    if (this._uidPaciente!=undefined && !isNaN(Number(this._uidPaciente)))
      this.uidPaciente = Number(this._uidPaciente);
    if (this.route.snapshot.paramMap.get("idPaciente")!=undefined)   
      this.uidPaciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    if (isNaN(Number(this._uidPaciente)))
      this.uidPaciente = -1;  
    
      this.llenarArrayAgentes();
    this.buscarAntecedentesOcupacionales();    
  }

  private async buscarPaciente(){
    if (this.uidPaciente!= undefined && this.uidPaciente!= null){
      await this.srvPaciente.pacienteUid(this.uidPaciente)
      .toPromise()
      .then(result => {
        if (result){          
          this.cedula=result[0].ci;
        }        
      })
    }
  }

  private async buscarAntecedentesOcupacionales(){
    
    if (this.uidPaciente!= undefined && this.uidPaciente!= null){
      await this.srvAntecedentesOcupacionales.riesgosPaciente(this.uidPaciente.toString())
      .toPromise()
      .then(async result => {
        
        if (result.length>0){
          
          this.antecedentesOcupacionales=result;          
          this.cedula=result[0].cedula; 
          this.tiempo="";
          this.periodo="";
          console.log(this.cedula);
                
        }
        else{
          await this.buscarPaciente();          
          this.antecedentesOcupacionales=[];
        }         
      })
    }    
  }

  private async llenarArrayAgentes(){    
      await this.srvAntecedentesOcupacionales.AgentesAll()
      .toPromise()
      .then(result => {
        if (result){
          
          this.ArrayAgentes=result;          
        }
        else
          this.ArrayAgentes=[{agente: ""}];        
      })       
  }  

  private async nuevoAntecedente(){ 
    this.antecedenteOcupacional.tiempo_exposicion= this.tiempo + ' ' + this.periodo;   
    await this.srvAntecedentesOcupacionales.registrarAntecedenteOcupacional(this.antecedenteOcupacional)
    .toPromise()
    .then( result  => {
      if (result){
        
        this.antecedentesOcupacionales.push({
          cedula: this.cedula,
          riesgo: { 
            uid_riesgo: result.fk_riesgo, 
            agente: this.ArrayExposiciones.find(e=> e.uid_riesgo===result.fk_riesgo).agente,
            descripcion: this.ArrayExposiciones.find(e=> e.uid_riesgo===result.fk_riesgo).descripcion,
            datos_requeridos: this.ArrayExposiciones.find(e=> e.uid_riesgo===result.fk_riesgo).datos_requeridos
          },
          tiempo_exposicion: result.tiempo_exposicion,
          resp: result.resp
        });
        
      }      
      this.antecedenteOcupacional.cedula=this.cedula;
      this.antecedenteOcupacional.fk_riesgo=null;
      this.antecedenteOcupacional.resp="";
      this.antecedenteOcupacional.tiempo_exposicion="";
    })
  }  

  async guardar(){    
    this.antecedenteOcupacional.cedula=this.cedula;
    this.popover = await this.validaEntradas();
    
    if ( this.popover.alerta!=undefined){ 
      
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo;
      this.popover={};      
      this.showSuccess(this.titleRegistrar+': '+this.alertaRegistrar, 'danger');     
      
      return;
    }

    await this.nuevoAntecedente();    
    
    if (this.antecedenteOcupacional){      
      this.showSuccess('Datos cargados satisfactoriamente', 'success');
    }else{     
      
        this.showSuccess('Error en el registro del antecedente familiar', 'danger'); 
    }
    
  }

  async llenarArrayExposiciones(agente: number){ 
    this.antecedenteOcupacional.fk_riesgo=null;
    await this.srvAntecedentesOcupacionales.riesgosAgente(this.agenteSelect)
    .toPromise()
    .then(result => {
      if (result){
        this.ArrayExposiciones=result;          
      }
      else
      this.ArrayExposiciones=[];        
    });
    this.cboRiesgos.nativeElement.focus();     
  }

  async colocarResp(){    
    this.antecedenteOcupacional.resp="";    
    for await (let e of this.ArrayExposiciones){       
        if (e.uid_riesgo==this.antecedenteOcupacional.fk_riesgo){          
          this.antecedenteOcupacional.resp=e.datos_requeridos;
          this.txtResp.nativeElement.focus();
          return;
        }        
    }    
    this.txtResp.nativeElement.focus(); 
  }


  
  reset(){
    this.antecedenteOcupacional.cedula=this.cedula;
    this.antecedenteOcupacional.fk_riesgo=null;
    this.antecedenteOcupacional.resp="";
    this.antecedenteOcupacional.tiempo_exposicion="";
    this.antecedentesOcupacionales=[];
  } 

  private async  validaEntradas(){
    let popOver: Ipopover={};

    if (this.antecedenteOcupacional.cedula==undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el paciente"
      };
         
      return  popOver;
    }

    if (this.antecedenteOcupacional.fk_riesgo == undefined || this.antecedenteOcupacional.fk_riesgo==null){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el riesgo"
      };
      this.cboRiesgos.nativeElement.focus();      
      return  popOver;
    }

    if (this.periodo != undefined || this.periodo!="")
      if (this.tiempo == undefined || this.tiempo==""){
        popOver= {
          titulo:"Error en el Registro",
          alerta: "Debe especificar el tiempo"
        };
        this.cboTiempoExposicion.nativeElement.focus();      
        return  popOver;
      }

    /*if (this.antecedenteOcupacional.resp == undefined || this.antecedenteOcupacional.resp ==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar las caracteristicas del riesgo"
      };
      this.txtResp.nativeElement.focus();       
      return  popOver;
    }*/

    /*if (this.antecedenteOcupacional.tiempo_exposicion == undefined || this.antecedenteOcupacional.tiempo_exposicion == ""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el tiempo expuesto"
      };
      this.cboEstatusFamiliar.nativeElement.focus();      
      return  popOver;
    }*/    

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