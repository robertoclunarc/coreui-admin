import { Component, ViewChild, OnInit, Inject, LOCALE_ID, NgModule, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { ICargoAnterior } from '../../../models/servicio-medico/cargos_anteriores.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { CargosAnterioresService } from '../../../services/servicio_medico/cargos_anteriores.service';

@Component({
  selector: 'app-cargos-anteriores',
  templateUrl: './cargos_anteriores.component.html',
  styleUrls: ['./cargos_anteriores.component.css'],
  providers: [ CargosAnterioresService , 
    { provide: AlertConfig }],
})
export class CargosAnterioresComponent implements OnInit {

  @ViewChild('txtCargo') inputCargo!: ElementRef<HTMLInputElement>;
  @ViewChild('txtActividad') inputActividad!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDesde') inputDesde!: ElementRef<HTMLInputElement>;
  @ViewChild('txtHasta') inputHasta!: ElementRef<HTMLInputElement>;

  constructor( 
    private route: ActivatedRoute,  
    private router: Router,
    private srvCargoAnterior: CargosAnterioresService,
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  private cargosAnteriores: ICargoAnterior[]=[]; 
  private cargoAnterior: ICargoAnterior={}; 
  private user: IUsuarios={};
  private tipoUser: string; 
  private alertaRegistrar: string; 
  private titleRegistrar: string;
  private popover: Ipopover={} ;
  private soloLectura: boolean;
  
  private alertsDismiss: any = [];

  ngOnInit(): void {
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
   
    this.cargoAnterior.fk_paciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    this.buscarCargos();    
  }

  private async buscarCargos(){
    
    if (this.cargoAnterior.fk_paciente!= undefined && this.cargoAnterior.fk_paciente!= null){
      await this.srvCargoAnterior.cargosAnterioresAll(this.cargoAnterior.fk_paciente.toString())
      .toPromise()
      .then(result => {
        if (result.length>0){
          this.cargosAnteriores=result; 
        }
        else
          this.cargosAnteriores=[]
        
      })
    }    
  }

  private async NuevoCargo(){
    this.cargoAnterior.desde=formatDate(this.cargoAnterior.desde, 'yyyy-MM-dd', 'en');
    this.cargoAnterior.hasta=formatDate(this.cargoAnterior.hasta, 'yyyy-MM-dd', 'en');
    await this.srvCargoAnterior.registrarCargoAnterior(this.cargoAnterior)
    .toPromise()
    .then( result  => {
      if (result){
        
        this.cargosAnteriores.push(result);
      }      
      this.cargoAnterior.cargo="";
      this.cargoAnterior.actividad_laboral="";
      this.cargoAnterior.desde="";
      this.cargoAnterior.hasta="";
      this.cargoAnterior.riesgos ="";
    })
  }  

  private async guardar(){    
    
    this.popover = await this.validaEntradas();
    
    if ( this.popover.alerta!=undefined){ 
      
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo;
      this.popover={};      
      this.showSuccess(this.titleRegistrar+': '+this.alertaRegistrar, 'danger');     
      
      return;
    }

    await this.NuevoCargo();    
    
    if (this.cargoAnterior){      
      this.showSuccess('Datos cargados satisfactoriamente', 'success');
    }else{     
      
        this.showSuccess('Error en el registro del cargo', 'danger'); 
    }
    
  }

  popHiden(){
        
    this.alertaRegistrar=undefined;
    this.titleRegistrar=undefined;
    this.popover={};
    
  } 

  reset(){
    this.cargoAnterior.cargo="";
    this.cargoAnterior.actividad_laboral="";
    this.cargoAnterior.desde="";
    this.cargoAnterior.hasta="";
    this.cargoAnterior.riesgos ="";
    this.cargosAnteriores=[];
    this.popHiden();
  } 

  private async  validaEntradas(){
    let popOver: Ipopover={};

    if (this.cargoAnterior.fk_paciente == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el paciente"
      };
         
      return  popOver;
    }

    if (this.cargoAnterior.cargo == undefined || this.cargoAnterior.cargo==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el cargo del paciente"
      };
      this.inputCargo.nativeElement.focus();      
      return  popOver;
    }

    if (this.cargoAnterior.actividad_laboral == undefined || this.cargoAnterior.actividad_laboral ==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la actividad del paciente"
      };
      this.inputActividad.nativeElement.focus();       
      return  popOver;
    }

    if (this.cargoAnterior.desde == undefined || this.cargoAnterior.desde == ""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la fecha desde que inicio el cargo del paciente"
      };
      this.inputDesde.nativeElement.focus();      
      return  popOver;
    }

    if (this.cargoAnterior.hasta == undefined || this.cargoAnterior.hasta == ""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la fecha fin del cargo del paciente"
      };
      this.inputHasta.nativeElement.focus();     
      return  popOver;
    }

    /*if (this.cargoAnterior.riesgos == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "No ha Seccionado el departamento"
      };      
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
