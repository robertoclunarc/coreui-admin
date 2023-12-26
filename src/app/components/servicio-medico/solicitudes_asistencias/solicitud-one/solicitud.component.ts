import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { formatDate } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
//Models
import { ISolicitudAtencion } from '../../../../models/servicio-medico/solicitudatencion.model';
//import { ITiempoReposo } from '../../../models/servicio-medico/tiemporeposos.model';
import { IPacienteConSupervisores, IvPaciente } from '../../../../models/servicio-medico/paciente.model';
import { Ipopover } from '../../../../models/servicio-medico/varios.model';
import { ImailOptions } from '../../../../models/servicio-medico/correo.model';
//Services
import { SolicitudAtencionService } from '../../../../services/servicio_medico/solicitudatencion.service';
import { PacientesService } from '../../../../services/servicio_medico/pacientes.service';
import { VarioService } from '../../../../services/servicio_medico/varios.service'
import { CorreoService } from '../../../../services/servicio_medico/correo.service';
import { TrabajadoresService } from '../../../../services/servicio_medico/trabajadores.service';
import { LoginSecioMedicoService } from '../../../../services/servicio_medico/login-secio-medico.service';
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { ITrabajadores } from '../../../../models/servicio-medico/trabajadores.model';

@Component({
  templateUrl: 'solicitud.component.html',
  selector: 'app-solicitud-one',  
  providers: [SolicitudAtencionService, PacientesService/*, TiempoReposoService*/, VarioService,
              { provide: AlertConfig }],
  styleUrls: ["solicitud.component.css"],
})
export class SolicitudComponent implements OnInit {  
  
  solicitud: ISolicitudAtencion={};
  subordinados: ITrabajadores[]=[]
  paciente: IPacienteConSupervisores={};
  fotoPaciente: any;
  imageDesconocido: any='../../../../../assets/img/avatars/desconocido.png';  
  alertaRegistrar: string=""; 
  titleRegistrar: string="";
  popover: Ipopover={} ;
  alertsDismiss: any = [];
  soloLectura: boolean = true;
  remitentes: string[] = [];
  arrayMotivos: string[] = ['Afeccion de Salud','Otro'];
  selectedMotivo: string="";
  tipoUser: string = "";
  private user: IUsuarios = {};
  dismissible = true;
  constructor(
    
    private router: Router,
    private srvPacientes: PacientesService,
    private srvSolicitud: SolicitudAtencionService,
    private srvVarios: VarioService,
    private srvCorreo: CorreoService,
    private srvTrabajadores: TrabajadoresService,
    private authenticationService: LoginSecioMedicoService,
    @Inject(LOCALE_ID) public locale: string,
    ) {  }

  ngOnInit(): void {

    if (sessionStorage.currentUser){  

      this.user=JSON.parse(sessionStorage.currentUser);
      console.log(this.user);
      if (this.user) {
        this.buscarSubordinados(this.user.login);   
        this.tipoUser= sessionStorage.tipoUser;
      }
      else {
            this.router.navigate(["serviciomedico/login"]);
      }
    }else{
      this.router.navigate(["serviciomedico/login"]);
    }
    
    this.fotoPaciente = this.imageDesconocido;
  }

  async buscarSubordinados(login: string){
    await this.srvTrabajadores.trabajadoresPorSigladoSupervisor(login)
      .toPromise()
      .then(async (res) => {        
        if (res.length>0){
          this.subordinados = res;
        }
      });
  }

  async subordinadoValido(idTrabajador: string): Promise<boolean> {
    for await (const trabajador of this.subordinados) {
      if (trabajador.trabajador === idTrabajador) {
        return true;
      }
    }  
    return false;
  }
   
  async buscarPaciente(){
    this.remitentes = [];
    if (this.paciente.ci!="" && this.paciente.ci!= undefined && this.paciente.ci!= null){
      if (await this.subordinadoValido(this.paciente.ci)){
        await this.srvPacientes.searchPacientesPromise(this.paciente.ci, 'null', 'null', 'null', 'null', 'and')      
        .then(async result => {
          if (result[0]!= undefined){
            this.paciente=result[0];
            this.paciente.edad=result[0].edad.years.toString();          
            this.solicitud = {
              ci_paciente : this.paciente.ci,
              id_paciente : this.paciente.uid_paciente,
              ci_supervisor : this.paciente.supervisor,
              nombres_jefe : this.paciente.nombres_jefe,
            }
            this.soloLectura = false;
            this.getThumbnail();
            
          }
          else{
            this.paciente={};
            this.soloLectura = true;
          }
        });
        await this.srvTrabajadores.trabajadoresOne(this.paciente.ci)
        .toPromise()
        .then(async (res) => {
          if (res.correo){
            this.remitentes.push(res.correo);
            this.solicitud.email_solicitante = res.correo;
          }
        });
        if (this.paciente.supervisor){
          await this.srvTrabajadores.trabajadoresOne(this.paciente.supervisor)
          .toPromise()
          .then(async (res) => {          
            if (res.correo){            
              this.remitentes.push(res.correo)
              this.solicitud.email_supervisor = res.correo;
            }
          });
        }
      }
      else{
        const ci: string = this.paciente.ci;
        this.reset();
        this.paciente.ci = ci;
        this.showSuccess(`Esta Cedula NO  Pertece a un Trabajador de Su Centro de Costo`, 'danger');
      } 
    }
  }

  seleccionarMotivo(motivo: string){
    if (motivo!='Otro'){
      this.solicitud.motivo = motivo;
    }else{
      this.solicitud.motivo = "";
    }
  }

  getThumbnail() : void {
    this.srvVarios.searchHeroes(this.paciente.ci)
      .subscribe(
        (val) => { 
          if (val.size>35)
            this.createImageFromBlob(val);
          else
          this.fotoPaciente = this.imageDesconocido;
        },
        response => {
          console.log("GET in error", response);
          this.fotoPaciente = this.imageDesconocido;
        },
        () => {
          console.log("GET observable is now completed.");
          
        });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.fotoPaciente = reader.result;
    }, false);
  if (image) {
      reader.readAsDataURL(image);
    }else this.fotoPaciente = this.imageDesconocido;
  }

  async guardar(){
    this.popover={};
    const fechaSolicitud: string = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
    try {
      
      this.popover = await this.validaEntradas();

      if ( this.popover.alerta!=undefined){        
        this.alertaRegistrar = this.popover.alerta;
        this.titleRegistrar = this.popover.titulo 
        return;
      }

      this.solicitud.fecha_solicitud = fechaSolicitud;
      this.solicitud.estatus = 'PENDIENTE';
      console.log(this.solicitud);
      const newSolicitud: ISolicitudAtencion =  await this.srvSolicitud.registrar(this.solicitud).toPromise();
      
      if (newSolicitud.uid){
        this.solicitud = newSolicitud;
        console.log(newSolicitud);
        this.showSuccess(`Solicitud enviada satisfactoriamente con El ID ${newSolicitud.uid}`, 'success');
        this.enviarNotificacionCorreo(fechaSolicitud, this.paciente, newSolicitud);
        this.reset(); 
      }
      else{
        this.showSuccess('Error en el registro', 'danger');
      }
    } catch (error) {
      console.error(error);
      this.showSuccess('Error en el registro: ' + error, 'danger');
    }
    
  }

  reset(){
    this.paciente={};
    this.solicitud={};
    this.soloLectura = true;
  }

  private async validaEntradas(){
    
    let popOver: Ipopover={};

    if (this.solicitud.ci_paciente === undefined || this.solicitud.ci_paciente.trim() === ""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "No ha Seccionado el Paciente"
      };      
      return  popOver;
    }

    if (this.solicitud.motivo === undefined || this.solicitud.motivo.trim() === ""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "No hay un Motivo especificado"
      };      
      return  popOver;
    }
    
    return popOver;    
  }

  async getRemitentes(actividad: string, ciPaciente: string, ciSupervisor: string){
    let data: string[]=[];
    await this.srvCorreo.remitentes(actividad)
      .toPromise()
      .then(async (res) => {
        data = res;
      });    
    return data;
  }

  async enviarCorreoHTML(mailOptions: ImailOptions) {    
    let respuesta: any;     
    respuesta = await this.srvCorreo.enviarBuffer(mailOptions);
    if (respuesta.error==undefined){
      console.log(`Info: ${respuesta?.info}`);
    }else{
      console.error(`Error: ${JSON.stringify(respuesta.error)}`);
    }
       
    return respuesta;  
  }

  async enviarNotificacionCorreo(fecha: string, paciente: IPacienteConSupervisores, solicitud: ISolicitudAtencion){
    
    const asunto: string = `Solicitud de Asistencia ID ${solicitud.uid}: Paciente ${paciente.nombre_completo}`;
    const cuerpo: string = await this.srvSolicitud.cuerpoCorreoNuevaSolicitud(paciente, fecha, solicitud);
    const actividad: string = "PRUEBA";
    let remitentes: string[] = await this.getRemitentes(actividad, paciente.ci, paciente.supervisor);
    for await (let r of this.remitentes){
      remitentes.push(r);
    }
    
    if (remitentes.length>0){
      const correos: string = remitentes.toString();
      const mailOptions: ImailOptions = {
        to: correos,
        subject: `${asunto}`,
        html: cuerpo,
      };
      this.enviarCorreoHTML(mailOptions)
      .then((result) => {        
        if (result.info)
          this.showSuccess(`Solicitud Enviada a: ${correos}`, 'warning');
        else
          this.showSuccess(`Error: ${result?.error}`, 'danger');
      });
    }  
  }

  salir(){
    this.authenticationService.logout();
    this.router.navigate(['serviciomedico/login']);
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }

  showSuccess(mensaje: string, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 15 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 15000
    });
  }
}
