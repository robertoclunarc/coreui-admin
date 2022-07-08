import { Component, ViewChild, OnInit, Inject, LOCALE_ID, NgModule, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { IsignosVitales } from '../../../models/servicio-medico/signos_vitales.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { SignosVitalesService } from '../../../services/servicio_medico/signosvitales.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

@Component({
  selector: 'app-signosvitales',
  templateUrl: './signosvitales.component.html',
  styleUrls: ['./signosvitales.component.css'],
  providers: [  SignosVitalesService, PacientesService,
    { provide: AlertConfig }],
})

export class SignosVitalesComponent implements OnInit {

  @ViewChild('txtTemper') txtTemper!: ElementRef<HTMLInputElement>;
  @ViewChild('txtTart') txtTart!: ElementRef<HTMLInputElement>; 
  @ViewChild('txtPulso') txtPulso!: ElementRef<HTMLInputElement>;
  @ViewChild('txtFresp') txtFresp!: ElementRef<HTMLInputElement>;
  @ViewChild('txtFcard') txtFcard!: ElementRef<HTMLInputElement>;
  @ViewChild('txtFecha') txtFecha!: ElementRef<HTMLInputElement>;
  
  constructor( 
    
    private route: ActivatedRoute,  
    private router: Router,
    private srvSignosVitales: SignosVitalesService, 
    private srvPaciente: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  private uidPaciente: number;
  private cedula: string;  
  private tipoSelect: string=null;
  private examenes: IsignosVitales[]=[]; 
  private examen: IsignosVitales={};
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
      await this.srvSignosVitales.signosVitalesPaciente(this.cedula)
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
    await this.srvSignosVitales.registrar(this.examen)
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

    if (this.objetoVacio(this.examen.fcard)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la frecuencia cardiaca"
      };
      this.txtFcard.nativeElement.focus();      
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
    if (this.objetoVacio(this.examen.fresp)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la frecuencia respiratoria"
      };
      this.txtFresp.nativeElement.focus();      
      return  popOver;
    }
    if (this.objetoVacio(this.examen.pulso)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el pulso"
      };
      this.txtPulso.nativeElement.focus();      
      return  popOver;
    }
    if (this.objetoVacio(this.examen.tart)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la tension arterial"
      };
      this.txtTart.nativeElement.focus();      
      return  popOver;
    }
    if (this.objetoVacio(this.examen.temper)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la temperatura"
      };
      //this.txtTemper.nativeElement.focus(); this.txtTart.nativeElement.focus(); this.txtPulso.nativeElement.focus();this.txtFresp.nativeElement.focus(); this.txtFecha.nativeElement.focus(); this.txtFcard.nativeElement.focus();   
      return  popOver;
    }

    return  popOver;
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