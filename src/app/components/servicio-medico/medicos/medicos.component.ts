import { Component, OnChanges, Inject, LOCALE_ID, Output, Input, EventEmitter, NgModule} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeaheadMatch} from 'ngx-bootstrap/typeahead';

//modelos
import { IMedicos, IParamedicos, IMedicosParamedicos } from '../../../models/servicio-medico/medicos.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { MedicosService } from '../../../services/servicio_medico/medicos.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css'],
  providers: [ MedicosService, 
    { provide: AlertConfig }],
})
export class MedicosComponent implements OnChanges {

  constructor( 
    private route: ActivatedRoute,  
    private router: Router,
    private srvMedicos: MedicosService,        
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  @Output() outMedico = new EventEmitter<IMedicosParamedicos>();
  @Input() ciMedico: string = "-1";
  
  medico: IMedicosParamedicos={};
  private user: IUsuarios={};
  private tipoUser: string; 
  alertaRegistrar: string=""; 
  titleRegistrar: string="";
  popover: Ipopover={} ;
  soloLectura: boolean;
  nuevo: boolean=true;
  arraytipoPersonal= [
    {valor: 'MEDICO', display: 'MEDICO'},
    {valor: 'PARAMEDICO', display: 'PARAMEDICO'},       
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
   
    this.medico.ci = this.route.snapshot.paramMap.get("ci")==undefined? this.ciMedico: this.route.snapshot.paramMap.get("ci")
    this.buscarMedico(this.medico.ci,'null','null','null','OR');    
  }

  async buscarMedico(ciMedico: string, nombre: string, uid: string, tipo: string, condlogica: string){
    
    if (this.medico.ci!="" && this.medico.ci!= undefined && this.medico.ci!= null){
      await this.srvMedicos.searchMedicosPromise(ciMedico, nombre, uid, tipo, condlogica)      
      .then(async result => {
        if (result.length>0){          
          this.medico=result[0];
          this.outMedico.emit(this.medico);
          this.nuevo=false;
        }
        else{            
            
            this.reset();
        }
        
      })
    }    
  }

  async buscarMedicoOne(){
    if (this.medico.ci!="" && this.medico.ci!= undefined && this.medico.ci!= null){
        await this.buscarMedico(this.medico.ci,'null','null','null','AND')
    }    
  }

  async registrarMedico(personal: IMedicos){
    await this.srvMedicos.registrarMedico(personal).toPromise();
  }

  async registrarParamedico(personal: IParamedicos){
    await this.srvMedicos.registrarParaMedico(personal).toPromise();
  }

  async actualizarMedico(personal: IMedicos){
    await this.srvMedicos.actualizarMedico(personal).toPromise();
  }

  async actualizarParamedico(personal: IParamedicos){
    await this.srvMedicos.actualizarParaMedico(personal).toPromise();
  }

  async guardar(){    
    let personalMedico: IMedicos={};
    let personalParaMedico: IParamedicos={}
    this.popover={};    
    let tipoPersonal: string;
    this.popover = await this.validaEntradas();

    if ( this.popover.alerta!=undefined){        
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo 
      return;
    }

    tipoPersonal = this.medico.tipo_medico;
    
    if (tipoPersonal=='MEDICO'){
        personalMedico={
            uid : this.medico.uid,
            nombre: this.medico.nombre,
            activo: true,
            ci: this.medico.ci,
            id_ss: this.medico.id_ss,
            nro_colegiado: this.medico.nro_colegiado,
            nombre_ssst: this.medico.nombre_ssst,
            tipo_ssst: this.medico.tipo_ssst,
            login: this.medico.login
        }
        
    }else{
        personalParaMedico={            
            uid   : this.medico.uid,
            nombre: this.medico.nombre,
            activo: true,
            ci: this.medico.ci,            
            login: this.medico.login
        }
    }
    
    await this.buscarMedico(this.medico.ci,'null', 'null', 'null', 'AND');    
    
    if (this.nuevo){
      if (tipoPersonal=='MEDICO'){
        await this.registrarMedico(personalMedico);
        this.medico=this.srvMedicos.medico;
             
      } else{
        await this.registrarParamedico(personalParaMedico);
        this.medico=this.srvMedicos.paraMedico;        
      }
      if (this.medico.uid!=undefined){
        this.outMedico.emit(this.medico);
        this.showSuccess(`Datos del ${tipoPersonal} registrados satisfactoriamente`, 'success');
      }else{
        this.showSuccess(`Error en el registro del ${tipoPersonal}`, 'danger'); 
      }
      
    }else{      
      
        if (tipoPersonal=='MEDICO'){
            await this.actualizarMedico(personalMedico);            
            this.medico=personalMedico;     
          } else{
            await this.actualizarParamedico(personalParaMedico);
            this.medico=personalParaMedico;       
          }
          if (this.srvMedicos.mensaje=='medico actualizado' || this.srvMedicos.mensaje=='paramedico actualizado'){
            this.outMedico.emit(this.medico);
            this.showSuccess(`Datos del ${tipoPersonal} actualizados satisfactoriamente`, 'success');
          }else{
            this.showSuccess(`Error en el registro: ${this.srvMedicos.mensaje}`, 'danger'); 
          }        
    }
    
    this.medico.tipo_medico=tipoPersonal;

  }

  reset(){
    this.medico={};
    this.nuevo=true;
    this.outMedico.emit(this.medico);    
  }

  private async  validaEntradas(){
    let popOver: Ipopover={};

    if (this.medico.ci == undefined || this.medico.ci==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la cedula de identidad del Personal"
      };      
      return  popOver;
    }

    if (this.medico.nombre == undefined || this.medico.nombre==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el nombre del Personal"
      };      
      return  popOver;
    }

    if (this.medico.tipo_medico == undefined || this.medico.tipo_medico==""){
        popOver= {
          titulo:"Error en el Registro",
          alerta: "Debe especificar el Tipo de Personal"
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
