import { Component, ViewChild, OnInit, Inject, LOCALE_ID, NgModule, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { Iantropometria } from '../../../models/servicio-medico/antropometria.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { AntropometriaService } from '../../../services/servicio_medico/antropometria.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

@Component({
  selector: 'app-antropometria',
  templateUrl: './antropometria.component.html',
  styleUrls: ['./antropometria.component.css'],
  providers: [  AntropometriaService, PacientesService,
    { provide: AlertConfig }],
})

export class AntropometriaComponent implements OnInit {

  @ViewChild('txtTalla') txtTalla!: ElementRef<HTMLInputElement>;
  @ViewChild('txtPeso') txtPeso!: ElementRef<HTMLInputElement>; 
  @ViewChild('txtImc') txtImc!: ElementRef<HTMLInputElement>;
  @ViewChild('txtFecha') txtFecha!: ElementRef<HTMLInputElement>;
  
  
  constructor( 
    
    private route: ActivatedRoute,  
    private router: Router,
    private srvAntropometria: AntropometriaService, 
    private srvPaciente: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  private uidPaciente: number;
  private cedula: string;  
  private examenes: Iantropometria[]=[]; 
  private examen: Iantropometria={talla:'0', peso:'0', imc: '0', cedula:'', fecha:''};
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
      await this.srvAntropometria.antropometriaPaciente(this.cedula)
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

  private async nuevoExamen(){     
    await this.srvAntropometria.registrar(this.examen)
    .toPromise()
    .then( result  => {
      if (result){
        
        this.examenes.unshift(result);        
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
      this.examen={talla:'0', peso:'0', imc: '0', cedula:'', fecha:''};
      this.showSuccess('Datos cargados satisfactoriamente', 'success');
    }else{     
      
        this.showSuccess('Error en el registro de la antropometria', 'danger'); 
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

    if (this.objetoVacio(this.examen.talla)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la talla"
      };
      this.txtTalla.nativeElement.focus();      
      return  popOver;
    }
    if (this.objetoVacio(this.examen.fecha)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la fecha"
      };
      this.txtFecha.nativeElement.focus();      
      return  popOver;
    }
    if (this.objetoVacio(this.examen.peso)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el peso"
      };
      this.txtPeso.nativeElement.focus();      
      return  popOver;
    }
    if (Number(this.examen.peso)==0 && Number(this.examen.talla)==0){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar algun dato en talla y/o peso"
      };
      this.txtPeso.nativeElement.focus();      
      return  popOver;
    }
    return  popOver;
  }

  private calc_imc(){    
    let talla = Number(this.examen.talla);
    let peso = Number(this.examen.peso)
    this.examen.imc=this.srvAntropometria.calculoImc(talla, peso);       
  }

  objetoVacio(object: any){
    return (object== undefined || object==null || object=="" || typeof object == "undefined")
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