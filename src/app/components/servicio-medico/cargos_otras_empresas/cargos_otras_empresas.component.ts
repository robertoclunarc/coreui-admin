import { Component, ViewChild, OnChanges, Inject, LOCALE_ID, NgModule, Input, Output, EventEmitter, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { ICargoAnteriorOtra } from '../../../models/servicio-medico/cargos_anteriores.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { CargosAnterioresService } from '../../../services/servicio_medico/cargos_anteriores.service';

@Component({
  selector: 'app-cargos-otras-empresas',
  templateUrl: './cargos_otras_empresas.component.html',
  styleUrls: ['./cargos_otras_empresas.component.css'],
  providers: [ CargosAnterioresService , 
    { provide: AlertConfig }],
})
export class CargosOtrasEmpresasComponent implements OnChanges {

  @Output() itemsCargosOtras= new EventEmitter<number>();
  @Input() _uidPaciente: string;
  @ViewChild('txtEmpresa') inputEmpresa!: ElementRef<HTMLInputElement>;
  @ViewChild('txtActividad') inputActividad!: ElementRef<HTMLInputElement>;
  @ViewChild('txtDesde') inputDesde!: ElementRef<HTMLInputElement>;
  @ViewChild('txtHasta') inputHasta!: ElementRef<HTMLInputElement>;

  constructor( 
    private route: ActivatedRoute,  
    private router: Router,
    private srvCargoAnterior: CargosAnterioresService,
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  cargosAnteriores: ICargoAnteriorOtra[]=[]; 
  cargoAnterior: ICargoAnteriorOtra={}; 
  private user: IUsuarios={};
  private tipoUser: string; 
  private alertaRegistrar: string; 
  private titleRegistrar: string;
  private popover: Ipopover={} ;
  private soloLectura: boolean;
  
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
      this.cargoAnterior.fk_paciente = Number(this._uidPaciente);
    if (this.route.snapshot.paramMap.get("idPaciente")!=undefined)
      this.cargoAnterior.fk_paciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    if (isNaN(Number(this._uidPaciente)))
      this.cargoAnterior.fk_paciente = -1;

      
    this.buscarCargos();    
  }

  private async buscarCargos(){
    if (this.cargoAnterior.fk_paciente!= undefined && this.cargoAnterior.fk_paciente!= null){
      await this.srvCargoAnterior.cargosAnterioresOtrasAll(this.cargoAnterior.fk_paciente.toString())
      .toPromise()
      .then(result => {
        if (result.length>0){
          this.cargosAnteriores=result;
          this.itemsCargosOtras.emit(this.cargosAnteriores.length);
        }
        else
          this.cargosAnteriores=[];        
      })
    }      
  }

  private async NuevoCargo(){
    this.cargoAnterior.desde=formatDate(this.cargoAnterior.desde, 'yyyy-MM-dd', 'en');
    this.cargoAnterior.hasta=formatDate(this.cargoAnterior.hasta, 'yyyy-MM-dd', 'en');
    await this.srvCargoAnterior.registrarCargoAnteriorOtra(this.cargoAnterior)
    .toPromise()
    .then( result  => {
      if (result){
        
        this.cargosAnteriores.push(result);
      }      
      this.cargoAnterior.empresa="";
      this.cargoAnterior.actividad_laboral="";
      this.cargoAnterior.desde="";
      this.cargoAnterior.hasta="";
      this.cargoAnterior.riesgos ="";
    })
  }  

  async guardar(){    
    
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
    this.cargoAnterior.empresa="";
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

    if (this.cargoAnterior.empresa == undefined || this.cargoAnterior.empresa==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la empresa"
      };
      this.inputEmpresa.nativeElement.focus();      
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
