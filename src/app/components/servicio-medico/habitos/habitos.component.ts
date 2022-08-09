import { Component, ViewChild, OnChanges, Input, Inject, LOCALE_ID, NgModule, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { IHabito, IvHabitos, IHabitoPaciente } from '../../../models/servicio-medico/habitos.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { HabitosService } from '../../../services/servicio_medico/habitos.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

@Component({
  selector: 'app-habitos',
  templateUrl: './habitos.component.html',
  styleUrls: ['./habitos.component.css'],
  providers: [  HabitosService, PacientesService,
    { provide: AlertConfig }],
})

export class HabitosComponent implements OnChanges {

  @Input() _uidPaciente: string;
  
  constructor( 
    
    private route: ActivatedRoute,  
    private router: Router,
    private srvHabitos: HabitosService, 
    private srvPaciente: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  private uidPaciente: number;
  private cedula: string;  
  tipoSelect: string=null;
  habitosPacientes: IvHabitos[]=[]; 
  habitoPaciente: IHabitoPaciente={};
  ArrayHabitos: IHabito[];   
  user: IUsuarios={};
  tipoUser: string; 
  alertaRegistrar: string; 
  titleRegistrar: string;
  popover: Ipopover={} ;
  soloLectura: boolean;  
  saved: boolean;
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

    if (this._uidPaciente!=undefined && !isNaN(Number(this._uidPaciente)))
      this.uidPaciente = Number(this._uidPaciente);
    if (this.route.snapshot.paramMap.get("idPaciente")!=undefined)
      this.uidPaciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    if (isNaN(Number(this._uidPaciente)))
      this.uidPaciente = -1;  
   
    await this.buscarPaciente();
    await this.llenarArrayhabitos();
    await this.buscarHabitosPorPaciente();
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

  private async buscarHabitosPorPaciente(){
    let habitosP: IvHabitos;    
    let obs: string="";
    let rsp: string="";
    if (this.cedula!= undefined && this.cedula!= null && this.cedula!=""){
      await this.srvHabitos.habitosPorCedula(this.cedula)
      .toPromise()
      .then(async result => {        
        for await (let hab of this.ArrayHabitos){
          habitosP={};
          obs="";
          rsp="";         
          for await (let hp of result){            
            if (hp.habito.uid_habito==hab.uid_habito){
              obs=hp.observacion;
              rsp=hp.resp
            }
          }          
          habitosP={
              cedula: this.cedula,
              habito: hab,                   
              observacion: obs,
              resp:  rsp
          };
          this.habitosPacientes.push(habitosP);
        }         
      })
    }    
  }

  private async llenarArrayhabitos(){    
      await this.srvHabitos.habitosAll()
      .toPromise()
      .then(result => {
        if (result){          
          this.ArrayHabitos=result;          
        }
        else
        this.ArrayHabitos=[];        
      })       
  }  

  private async nuevoHabito(){ 
    await this.srvHabitos.eliminarPorCedula(this.cedula).toPromise();
    for await (let hab of this.habitosPacientes){
      if (hab.resp!=undefined && hab.resp!="" && hab.resp!="") { 
        this.habitoPaciente={
          cedula: this.cedula,
          fk_habito: hab.habito.uid_habito,
          resp: hab.resp,
          observacion: hab.observacion
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
    }  
  }  

  async guardar(){
    this.saved=false;     
    this.habitoPaciente.cedula=this.cedula;   
    this.popover = await this.validaEntradas();
    
    if ( this.popover.alerta!=undefined){ 
      
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo;
      this.popover={};      
      this.showSuccess(this.titleRegistrar+': '+this.alertaRegistrar, 'danger');     
      
      return;
    }

    await this.nuevoHabito();    
    
    if (this.saved){ 
      this.habitoPaciente={};     
      this.showSuccess('Datos cargados satisfactoriamente', 'success');
    }else{     
      
        this.showSuccess('Error en el registro del habito del paciente', 'danger'); 
    }    
  }   

  private async  validaEntradas(){
    let popOver: Ipopover={};

    if (this.cedula==undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el paciente"
      };         
      return  popOver;
    }

    for await (let hab of this.habitosPacientes){
      if (hab.resp == undefined || hab.resp==null || hab.resp==""){
        popOver= {
          titulo:"Error en el Registro",
          alerta: "Debe dar una repuesta a:  " + hab.habito.descripcion
        };           
        return  popOver;
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