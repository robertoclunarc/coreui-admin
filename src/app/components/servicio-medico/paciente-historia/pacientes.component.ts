import { Component, OnChanges, Inject, LOCALE_ID, Output, Input, EventEmitter} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeaheadMatch} from 'ngx-bootstrap/typeahead';

//modelos
import { IvPaciente, IPaciente } from '../../../models/servicio-medico/paciente.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover, INivelAcademico, IContratista } from '../../../models/servicio-medico/varios.model';
import { IvDepartamentos, IGerencia } from '../../../models/servicio-medico/departamentos.model';


//servicios
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';
import { DepartamentosService } from '../../../services/servicio_medico/departamentos.service';
import { VarioService } from '../../../services/servicio_medico/varios.service';

@Component({
  selector: 'app-paciente-historia',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
  providers: [ PacientesService, DepartamentosService, VarioService, 
    { provide: AlertConfig }],
})
export class PacientesHistoriaComponent implements OnChanges {

  constructor( 
    private route: ActivatedRoute,  
    private router: Router,
    private srvPacientes: PacientesService, 
    private srvDepartamentos: DepartamentosService,
    private srvVarios: VarioService,   
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  @Output() outPaciente = new EventEmitter<IvPaciente>();
  @Input() ciPaciente: string = "-1";

  paciente: IvPaciente={};  
  private user: IUsuarios={};
  private tipoUser: string; 
  alertaRegistrar: string=""; 
  titleRegistrar: string="";
  popover: Ipopover={} ;
  soloLectura: boolean;
  gerencia: IGerencia={};
  arrayGerencias: IGerencia[]=[];
  arrayDepartamentos: IvDepartamentos[]=[];
  arrayFrecuenciaRotacion= [
    {valor: 'Indeterminada', display: 'Indeterminada'},
    {valor: 'Diaria', display: 'Diaria'},
    {valor: 'Semanal', display: 'Semanal'},
    {valor: 'Mensual', display: 'Mensual'},
    {valor: 'Trimestral', display: 'Semestral'},
    {valor: 'Anual', display: 'Anual'}    
  ];
  arrayNivelEducativo: INivelAcademico[]=[];
  arrayTipoDiscapacidad= [
    {label:'SIN CONDICION', value:'SIN CONDICION'},
    {label:'AUDITIVA', value:'AUDITIVA'},
    {label:'MOTRIZ', value:'MOTRIZ'},
    {label:'VISUAL', value:'VISUAL'},    
  ];
  arrayEdoCivil= [    
    {label:'Solter@', value:'Solter@'},
    {label:'Casad@', value:'Casad@'},
    {label:'Divorciad@', value:'Divorciad@'},
    {label:'Concubin@', value:'Concubin@'},
  ];

  arrayContratista: IContratista[]=[];
  ObjContratista: IContratista={};
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
   
    this.paciente.ci = this.route.snapshot.paramMap.get("ci")==undefined? this.ciPaciente: this.route.snapshot.paramMap.get("ci")
    this.buscarPaciente();
    this.llenarArrayDepartamento();
    this.llenarArrayGerencias();
    this.llenarArrayNIvelesAcademicos();
    this.llenarArrayContratistas();
  }

  async buscarPaciente(){
    
    if (this.paciente.ci!="" && this.paciente.ci!= undefined && this.paciente.ci!= null){
      await this.srvPacientes.pacienteOne(this.paciente.ci)
      .toPromise()
      .then(async result => {
        if (result[0]!= undefined){
          this.paciente=result[0];
          this.paciente.fechanac= formatDate(this.paciente.fechanac, 'yyyy-MM-dd', 'en');
          this.paciente.fecha_ingreso=formatDate(this.paciente.fecha_ingreso, 'yyyy-MM-dd', 'en');
          this.paciente.antiguedad_puesto=formatDate(this.paciente.antiguedad_puesto, 'yyyy-MM-dd', 'en');
          this.ObjContratista.uid=this.paciente.id_contratista;
          this.ObjContratista.nombre=this.paciente.contratista;
          //this.gerencia.uid = this.arrayGerencias.find( (g: any) => {return g.nombre==this.paciente.gcia}).uid;
          for await (let g of this.arrayGerencias){
            if (g.nombre==this.paciente.gcia){
              this.gerencia.uid=g.uid;
              break;
            }
          }
          this.gerencia.nombre = this.paciente.gcia;
          this.outPaciente.emit(this.paciente);
        }
        else
          this.paciente={} 
        
      })
    }    
  }

  private llenarArrayNIvelesAcademicos(){
      this.srvVarios.nivelesAcademicos()
      .toPromise()
      .then(result => {
        if (result){
          this.arrayNivelEducativo=result;
        }
      })
  }

  private llenarArrayContratistas(){
    this.srvVarios.contratistaAll()
    .toPromise()
    .then(result => {
      if (result){
        this.arrayContratista=result;
      }
    })
  }

  private async nuevoContratistas(){
    await this.srvVarios.registrarContratista(this.ObjContratista)
    .toPromise()
    .then( result  => {
      if (result){
        this.ObjContratista=result;
        this.arrayContratista.push(this.ObjContratista);
      }
    })
  }

  private llenarArrayDepartamento(){
    this.srvDepartamentos.departamentosFilter('null', 'null', 'null', 'null')
    .toPromise()
    .then(result => {
      if (result){
        this.arrayDepartamentos=result;
      }
    })
  }

  private llenarArrayGerencias(){
    this.srvDepartamentos.gerenciasAll()
    .toPromise()
    .then(result => {
      if (result){
        this.arrayGerencias=result;
      }
    })
  }

  async guardar(){    
    let pacienteAux: IvPaciente = this.paciente;
    this.popover={};
    if (this.paciente.es_contratista && (this.ObjContratista.uid== undefined ||  this.ObjContratista==null)){
      this.ObjContratista.nombre=this.paciente.contratista;
      await this.nuevoContratistas();
    }

    this.popover = await this.validaEntradas();

    if ( this.popover.alerta!=undefined){        
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo 
      return;
    }

    let ObjPaciente: IPaciente={
      uid_paciente: this.paciente.uid_paciente,
      ci: this.paciente.ci,
      nombre: this.paciente.nombre,
      apellido: this.paciente.apellido,
      id_departamento: this.paciente.id_departamento,
      es_contratista: this.paciente.es_contratista,
      fechanac: formatDate(this.paciente.fechanac, 'yyyy-MM-dd HH:mm:ss', this.locale),
      sexo: this.paciente.sexo,
      cargo: this.paciente.cargo,
      turno: this.paciente.turno,
      antiguedad_puesto: formatDate(this.paciente.antiguedad_puesto, 'yyyy-MM-dd HH:mm:ss', this.locale),
      fecha_ingreso: formatDate(this.paciente.fecha_ingreso, 'yyyy-MM-dd HH:mm:ss', this.locale),
      tipo_sangre: this.paciente.tipo_sangre,
      lugar_nac : this.paciente.lugar_nac,
      edo_civil : this.paciente.edo_civil,
      nacionalidad: this.paciente.nacionalidad,
      telefono: this.paciente.telefono,
      direccion_hab: this.paciente.direccion_hab,
      //fecharegistro: formatDate(this.paciente.fecharegistro, 'yyyy-MM-dd HH:mm:ss', this.locale),
      id_contratista: this.ObjContratista.uid,
      mano_dominante: this.paciente.mano_dominante,
      frecuencia_rotacion: this.paciente.frecuencia_rotacion,
      nivel_educativo: this.paciente.nivel_educativo,
      //tipo_vivienda: this.paciente.tipo_vivienda,
      //vivienda_propia: this.paciente.vivienda_propia,
      //medio_transp_trabajo: this.paciente.medio_transp_trabajo,
      alergia: this.paciente.alergia,
      tipo_discapacidad: this.paciente.tipo_discapacidad,
      desc_discapacidad: this.paciente.desc_discapacidad,
      estado_paciente: this.paciente.estado_paciente
    };

    await this.buscarPaciente();
    
    if (this.paciente.ci!=undefined){
      await this.srvPacientes.actualizar(ObjPaciente).toPromise();
      this.showSuccess('Datos del Paciente actualizados satisfactoriamente', 'success');
    }else{
      
      this.paciente.fecharegistro=formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
      ObjPaciente.fecharegistro=formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
      await this.srvPacientes.registrar(ObjPaciente).toPromise();
      pacienteAux.uid_paciente= this.srvPacientes.paciente.uid_paciente;
      if (pacienteAux.uid_paciente)
        this.showSuccess('Datos del Paciente registrados satisfactoriamente', 'success');
      else
        this.showSuccess('Error en el registro del paciente', 'danger'); 
    }
    
    pacienteAux.id_contratista=this.ObjContratista.uid;
    this.paciente=pacienteAux;
    
  }

  reset(){
    this.paciente={};
    this.outPaciente.emit(this.paciente);
    this.gerencia={};
    this.ObjContratista={};
  }

  onSelect(event: TypeaheadMatch): void {
    this.ObjContratista = event.item;
    this.paciente.contratista = this.ObjContratista.nombre;
    console.log(this.ObjContratista);
  }

  seleccionarGerencia(uidDepartamento: number){
    this.gerencia.uid = this.arrayDepartamentos.find( g => (g.departamento.uid==uidDepartamento)).gerencia.uid;
    this.gerencia.nombre = this.arrayDepartamentos.find( g => (g.departamento.uid==uidDepartamento)).gerencia.nombre;
  }

  private async  validaEntradas(){
    let popOver: Ipopover={};

    if (this.paciente.ci == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la cedula de identidad del paciente"
      };      
      return  popOver;
    }

    if (this.paciente.nombre == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el nombre del paciente"
      };      
      return  popOver;
    }

    if (this.paciente.apellido == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el apellido del paciente"
      };      
      return  popOver;
    }

    if (this.paciente.sexo == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el sexo del paciente"
      };      
      return  popOver;
    }

    if (this.paciente.ci == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la cedula de identidad"
      };      
      return  popOver;
    }

    if (this.paciente.id_departamento == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "No ha Seccionado el departamento"
      };      
      return  popOver;
    }

    if (this.paciente.fechanac == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la fecha de nacimiento del paciente"
      };      
      return  popOver;
    }

    if (this.paciente.tipo_sangre == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el tipo de sangre del paciente"
      };      
      return  popOver;
    }

    if (this.paciente.cargo == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el Cargo"
      };      
      return  popOver;
    }

    if (this.paciente.es_contratista && this.paciente.contratista==undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el nombre del contratista"
      };      
      return  popOver;
    }

    if (this.paciente.fecha_ingreso == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la fecha de ingreso del paciente"
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
