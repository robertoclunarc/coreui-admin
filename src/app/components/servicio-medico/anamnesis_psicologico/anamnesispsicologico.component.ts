import { Component, ViewChild, OnChanges, Input, Inject, LOCALE_ID, NgModule, ElementRef, Output, EventEmitter} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

//modelos
import { IAnalisisPsicologico, IEstudioPsicologico, IAnamnesisPsicologico } from '../../../models/servicio-medico/anamnesispsicologico.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { AnamnesisPsicologicoService } from '../../../services/servicio_medico/anamnesispsicologico.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

@Component({
  selector: 'app-anamnesispsicologico',
  templateUrl: './anamnesispsicologico.component.html',
  styleUrls: ['./anamnesispsicologico.component.css'],
  providers: [  AnamnesisPsicologicoService, PacientesService,
    { provide: AlertConfig }],
})

export class AnamnesisPsicologicoComponent implements OnChanges {   
  
  constructor( 
    
    private route: ActivatedRoute,  
    private router: Router,
    private srvAnamnesis: AnamnesisPsicologicoService, 
    private srvPaciente: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  @Output() itemAnamnesis= new EventEmitter<number>();
  @Input() _uidPaciente: string;
  private uidPaciente: number;
  private cedula: string;  
  private tipoSelect: string=null;
  public estudiosPacientes: IAnamnesisPsicologico[]=[]; 
  private analisisPaciente: IAnalisisPsicologico={};
  private ArrayEstudios: IEstudioPsicologico[];   
  private user: IUsuarios={};
  private tipoUser: string; 
  private alertaRegistrar: string; 
  private titleRegistrar: string;
  private popover: Ipopover={} ;
  public soloLectura: boolean;  
  private saved: boolean;
  public alertsDismiss: any = [];

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
   
    //this.uidPaciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    await this.buscarPaciente();
    await this.llenarArrayEstudios();
    await this.buscarEstudiosPorPaciente();
  }

  private async buscarPaciente(){
    if (this.uidPaciente!= undefined && this.uidPaciente!= null){
      
      await this.srvPaciente.pacienteUid(this.uidPaciente)
      .toPromise()
      .then(result => {
        if (result!=null && result.ci!=undefined){
           
          this.cedula=result.ci;
        }        
      })
    }
  }

  private async buscarEstudiosPorPaciente(){
    let analisisP: IAnamnesisPsicologico;    
    let obs: string="";
    let fecha: string="";
    if (this.cedula!= undefined && this.cedula!= null && this.cedula!=""){
      await this.srvAnamnesis.estudiosPsicologicosPorCedula(this.cedula)
      .toPromise()
      .then(async result => {        
        for await (let anm of this.ArrayEstudios){
          analisisP={};
          obs="";
          fecha="";          
          for await (let es of result){            
            if (es.estudio.uid_estudio==anm.uid_estudio){
              obs=es.observacion;
              if (es.fecha_estudio==null || es.fecha_estudio==undefined || es.fecha_estudio=="")
                  fecha=es.fecha_estudio
              else 
                  fecha=formatDate(es.fecha_estudio, 'yyyy-MM-dd', 'en')  
            }
          }                  
          analisisP={
              cedula: this.cedula,
              estudio: anm,                   
              observacion: obs,
              fecha_estudio: fecha
          };
          this.estudiosPacientes.push(analisisP) 
        } 
        this.itemAnamnesis.emit(result.length);  
      })
    }    
  }

  private async llenarArrayEstudios(){    
      await this.srvAnamnesis.estudiosPsicologicosAll()
      .toPromise()
      .then(result => {
        if (result){ 
          
          this.ArrayEstudios=result;          
        }
        else
          this.ArrayEstudios=[];        
      })       
  }  

  private async nuevoEstudios(){ 
    await this.srvAnamnesis.eliminarPorCedula(this.cedula).toPromise();
    let fecha: string;
    for await (let es of this.estudiosPacientes){
      if (es.observacion!=null && es.observacion!=undefined && es.observacion!=""){
        if (es.fecha_estudio==null || es.fecha_estudio==undefined || es.fecha_estudio=="")
          fecha=es.fecha_estudio
        else 
          fecha=formatDate(es.fecha_estudio, 'yyyy-MM-dd', 'en')
        this.analisisPaciente={
          cedula: this.cedula,
          fk_estudio: es.estudio.uid_estudio,
          fecha_estudio: fecha,
          observacion: es.observacion
        }
        await this.srvAnamnesis.registrar(this.analisisPaciente)
        .toPromise()
        .then( result  => {
          if (result){
            this.saved=true;
            
          }else{
            this.saved=false;
            this.showSuccess('Error en el registro del estudio del paciente: ' + es.estudio.descripcion, 'danger'); 
            return;
          }      
        })
      }
    }  
  }

  async guardar(){
    this.saved=false;     
    this.analisisPaciente.cedula=this.cedula;   
    this.popover = await this.validaEntradas();
    
    if ( this.popover.alerta!=undefined){ 
      
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo;
      this.popover={};      
      this.showSuccess(this.titleRegistrar+': '+this.alertaRegistrar, 'danger');     
      
      return;
    }

    await this.nuevoEstudios();    
    
    if (this.saved){ 
      this.analisisPaciente={};     
      this.showSuccess('Datos cargados satisfactoriamente', 'success');
    }else{      
        this.showSuccess('Error en el registro del estudio del paciente', 'danger'); 
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

    for await (let es of this.estudiosPacientes){
      console.log(es.fecha_estudio);
      if ((es.observacion != undefined && es.observacion!=null && es.observacion!="") &&  (es.fecha_estudio== undefined || es.fecha_estudio== null || es.fecha_estudio== "") ){
        popOver= {
          titulo:"Error en el Registro",
          alerta: "Debe dar una fecha a la repuesta de:  " + es.estudio.descripcion
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