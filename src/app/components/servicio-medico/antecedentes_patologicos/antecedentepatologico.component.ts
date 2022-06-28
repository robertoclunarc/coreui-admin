import { Component, ViewChild, OnInit, Inject, LOCALE_ID, NgModule, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { IAnatomia, IExamenesFuncionales, IExamenFuncional } from '../../../models/servicio-medico/anatomias.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { AnatomiasService } from '../../../services/servicio_medico/anatomia.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

@Component({
  selector: 'app-antecedentepatologico',
  templateUrl: './antecedentepatologico.component.html',
  styleUrls: ['./antecedentepatologico.component.css'],
  providers: [  AnatomiasService, PacientesService,
    { provide: AlertConfig }],
})

export class AntecedentePatologicoComponent implements OnInit {

  @ViewChild('cboPatologias') cboPatologias!: ElementRef<HTMLInputElement>;   
  
  constructor( 
    
    private route: ActivatedRoute,  
    private router: Router,
    private srvAnatomia: AnatomiasService, 
    private srvPaciente: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  private uidPaciente: number;
  private cedula: string;  
  private tipoSelect: string=null;
  private examenes: IExamenesFuncionales[]=[]; 
  private examen: IExamenFuncional={};
  private ArrayTiposAnatomias: {tipo: string}[]; 
  private ArrayPatologias: IAnatomia[]=[]; 
  private user: IUsuarios={};
  private tipoUser: string; 
  private alertaRegistrar: string; 
  private titleRegistrar: string;
  private popover: Ipopover={} ;
  private soloLectura: boolean;  
  
  private alertsDismiss: any = [];

  async ngOnInit() {
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
   
    this.uidPaciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    await this.buscarPaciente();
    this.llenarArrayZonaCorporal();
    this.buscarExamenesFuncionales();    
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

  private async buscarExamenesFuncionales(){
    
    if (this.cedula!= undefined && this.cedula!= null && this.cedula!=""){
      await this.srvAnatomia.examenesFuncionales(this.cedula)
      .toPromise()
      .then(async result => {
        
        if (result.length>0){          
          this.examenes=result; 
                    
        }
        else{                   
          this.examenes=[];
        }         
      })
    }    
  }

  private async llenarArrayZonaCorporal(){    
      await this.srvAnatomia.anatomiasTipos()
      .toPromise()
      .then(result => {
        if (result){          
          this.ArrayTiposAnatomias=result;          
        }
        else
          this.ArrayTiposAnatomias=[{tipo: ""}];        
      })       
  }

  private async llenarArrayPatologias(tipo: string){ 
    
    await this.srvAnatomia.anatomiasPorTipos(tipo)
    .toPromise()
    .then(result => {
      if (result){
        this.ArrayPatologias=result;          
      }
      else
        this.ArrayPatologias=[];        
    });
    this.cboPatologias.nativeElement.focus();     
  }

  private async nuevoExamen(){     
    await this.srvAnatomia.registrar(this.examen)
    .toPromise()
    .then( result  => {
      if (result){
        
        this.examenes.push({
          cedula: result.cedula,
          observacion: result.observacion,
          anatomia: this.ArrayPatologias.find((p)=> p.uid_anatom==result.fk_anatomia)
        });        
      }else{
        this.examen={};
      }      
    })
  }  

  private async guardar(){    
    this.examen.cedula=this.cedula;   
    this.popover = await this.validaEntradas();
    
    if ( this.popover.alerta!=undefined){ 
      
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo;
      this.popover={};      
      this.showSuccess(this.titleRegistrar+': '+this.alertaRegistrar, 'danger');     
      
      return;
    }

    await this.nuevoExamen();    
    
    if (this.examen){ 
      this.examen={};     
      this.showSuccess('Datos cargados satisfactoriamente', 'success');
    }else{     
      
        this.showSuccess('Error en el registro del antecedente familiar', 'danger'); 
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

    if (this.examen.fk_anatomia == undefined || this.examen.fk_anatomia==null){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la patologia"
      };
      this.cboPatologias.nativeElement.focus();      
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