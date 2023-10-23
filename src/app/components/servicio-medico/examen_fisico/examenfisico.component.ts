import { Component, ViewChild, OnChanges,Input, Inject, LOCALE_ID, NgModule, ElementRef, Output, EventEmitter} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

//modelos
import { IEstudiosFisico, IExamenFisico, IExamenesFisicosPacientes  } from '../../../models/servicio-medico/estudiofisico.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { EstudiosFisicosService } from '../../../services/servicio_medico/estudiofisico.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

@Component({
  selector: 'app-examenfisico',
  templateUrl: './examenfisico.component.html',
  styleUrls: ['./examenfisico.component.css'],
  providers: [  EstudiosFisicosService, PacientesService,
    { provide: AlertConfig }],
})

export class EstudiosFisicosComponent implements OnChanges {   
  
  constructor( 
    
    private route: ActivatedRoute,  
    private router: Router,
    private srvExamenFisico: EstudiosFisicosService, 
    private srvPaciente: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  @Output() itemExamenFisico3= new EventEmitter<number>();
  @Input() _uidPaciente: string;
  private uidPaciente: number;
  private cedula: string;  
  tipoSelect: string=null;
  estudiosPacientes: IExamenesFisicosPacientes[]=[]; 
  analisisPaciente: IExamenFisico={};
  ArrayEstudios: IEstudiosFisico[];   
  user: IUsuarios={};
  tipoUser: string; 
  alertaRegistrar: string; 
  titleRegistrar: string;
  private popover: Ipopover={} ;
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
            this.router.navigate(["serviciomedico/login"]);
      }
    }else{
      this.router.navigate(["serviciomedico/login"]);
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
    let analisisP: IExamenesFisicosPacientes;    
    let obs: string="";
    let fecha: string="";
    if (this.cedula!= undefined && this.cedula!= null && this.cedula!=""){
      await this.srvExamenFisico.EstudiosFisicosPorCedula(this.cedula)
      .toPromise()
      .then(async result => {        
        for await (let exm of this.ArrayEstudios){
          analisisP={};
          obs="";
          fecha="";          
          for await (let es of result){            
            if (es.examen.uid_est_fisico==exm.uid_est_fisico){
              obs=es.observacion;
              if (es.fecha_examen==null || es.fecha_examen==undefined || es.fecha_examen=="")
                  fecha=es.fecha_examen
              else 
                  fecha=formatDate(es.fecha_examen, 'yyyy-MM-dd', 'en')  
            }
          }                  
          analisisP={
              cedula: this.cedula,
              examen: exm,                   
              observacion: obs,
              fecha_examen: fecha
          };
          this.estudiosPacientes.push(analisisP) 
        } 
        this.itemExamenFisico3.emit(result.length); 
      })
    }    
  }

  private async llenarArrayEstudios(){    
      await this.srvExamenFisico.EstudiosFisicosAll()
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
    await this.srvExamenFisico.eliminarPorCedula(this.cedula).toPromise();
    let fecha: string;
    for await (let es of this.estudiosPacientes){
      if (es.observacion!=null && es.observacion!=undefined && es.observacion!=""){
        if (es.fecha_examen==null || es.fecha_examen==undefined || es.fecha_examen=="")
          fecha=es.fecha_examen
        else 
          fecha=formatDate(es.fecha_examen, 'yyyy-MM-dd', 'en')
        this.analisisPaciente={
          cedula: this.cedula,
          fk_fisico: es.examen.uid_est_fisico,
          fecha_examen: fecha,
          observacion: es.observacion
        }
        await this.srvExamenFisico.registrar(this.analisisPaciente)
        .toPromise()
        .then( result  => {
          if (result){
            this.saved=true;
            
          }else{
            this.saved=false;
            this.showSuccess('Error en el registro del estudio del paciente: ' + es.examen.descripcion, 'danger'); 
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
      console.log(es.fecha_examen);
      if ((es.observacion != undefined && es.observacion!=null && es.observacion!="") &&  (es.fecha_examen== undefined || es.fecha_examen== null || es.fecha_examen== "") ){
        popOver= {
          titulo:"Error en el Registro",
          alerta: "Debe dar una fecha a la repuesta de:  " + es.examen.descripcion
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