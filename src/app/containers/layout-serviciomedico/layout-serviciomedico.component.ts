import { Component} from '@angular/core';
import { navItems } from '../../_nav';
import { NavigationEnd, Router } from '@angular/router';
import { LoginSecioMedicoService } from '../../services/servicio_medico/login-secio-medico.service';
import { ConsultasService } from '../../services/servicio_medico/consultas.service';
import { MedicosService } from '../../services/servicio_medico/medicos.service';
import { MenusService } from '../../services/servicio_medico/menu_serviciomedico.service';
import { IUsuarios } from '../../models/servicio-medico/usuarios.model';
import { ItotalAtenciones } from '../../models/servicio-medico/medicos.model';
import { environment } from '../../../environments/environment';
import { SolicitudAtencionService } from '../../services/servicio_medico/solicitudatencion.service';
import { ISolicitudAtencion, ISolicitudesAtenciones } from '../../models/servicio-medico/solicitudatencion.model';
 
@Component({
  selector: 'app-layout-serviciomedico',
  templateUrl: './layout-serviciomedico.component.html',
  styleUrls: ['./layout-serviciomedico.css']
})
export class LayoutServicioMedicoComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public totalAtenciones: any;
  sistemaActual: string;
  private user: IUsuarios={};
  soportesUser: IUsuarios[]=[];
  nroMensajes: number=0;
  claseMensaje: string;
  imagenUser: string="";
  totalesAtenciones: ItotalAtenciones[]=[];
  totalGlobalAtenciones: number;
  modoOscuro: boolean;
  nameSistem: string;
  preVacaciones: number =0;
  posVacaciones: number=0;
  proximasCitas: number=0;
  private intervalIdGetData: ReturnType<typeof setInterval>;
 
  constructor(
    private router: Router,
    private srvLoginService: LoginSecioMedicoService,
    private srvConsultaMedica: ConsultasService, 
    private srvMedicos: MedicosService,
    private srvMenuServicioMedico: MenusService,
    private srvSolicitudAtencion: SolicitudAtencionService,
    ) {
        this.nameSistem = environment.nameSistema;
        if (this.nroMensajes>0)
          this.claseMensaje="badge badge-pill badge-danger";
        else
          this.claseMensaje="badge badge-pill badge-info";

        if (sessionStorage.currentUser){ 
          this.user=JSON.parse(sessionStorage.currentUser);
          if (sessionStorage.sistemaActual=='ServicioMedico'){
            srvConsultaMedica.consultasCount(this.user.login).toPromise().then(resutl => { this.totalAtenciones=resutl});        
            this.sistemaActual=sessionStorage.sistemaActual;        
            
            this.imagenUser= this.user.login ? `assets/img/avatars/${this.user.login}.bmp` : "";
            
            if (this.imagenUser!=="")
              if (this.imageExists(this.imagenUser)==false)
                this.imagenUser= 'assets/img/avatars/desconocido.png';

            this.srvMedicos.contadorAtenciones()
            .toPromise()
            .then( result => {
              
              this.totalesAtenciones = result; 
              
              this.srvMedicos.contadorTotalAtenciones().toPromise().then(resutl => { this.totalGlobalAtenciones=resutl});

              this.srvLoginService.usuariosFiltrados(61).toPromise().then(resutl => { this.soportesUser=resutl});
              
            });
          }
        }else{
          this.router.navigate(["/"]);
        }
        
        
      }

  ngOnInit(): void {
    this.navItems = [];
    
    if (sessionStorage.modoOscuro==undefined || sessionStorage.modoOscuro=='Off'){
      sessionStorage.setItem('modoOscuro', "Off");
      sessionStorage.setItem('classTable', "table table-striped");
      this.modoOscuro=false;
    }
    else {
      sessionStorage.setItem('modoOscuro', "On");
      sessionStorage.setItem('classTable', "table table-striped table-dark");
      this.modoOscuro=true;
    }    
           
    if (sessionStorage.sistemaActual=='ServicioMedico'){      
      this.menusUsuarioServicioMedico(this.user.login);
    }

    this.solicitudesAtencion();
    this.cantProximasCitas();
    this.intervalIdGetData = setInterval(() => {
      this.getData();
    }, 120000); 
  }

  async getData(): Promise<void>{
    await this.solicitudesAtencion();
    await this.cantProximasCitas();
  }
    
  private async menusUsuarioServicioMedico(user: string) {    
		return await this.srvMenuServicioMedico.menusUser(user)
			.toPromise()
      .then(results => {
				this.navItems = results;
			})
			.catch(err => { console.log(err) });
	}

  private async solicitudesAtencion() {    
		return await this.srvSolicitudAtencion.solicitudesPendientes()
			.toPromise()
      .then(results => {
				const solicitudes: ISolicitudAtencion[] = results;
        this.preVacaciones = solicitudes.filter((s: ISolicitudAtencion)=> { return s.motivo == "PRE VACACIONES" }).length
        this.posVacaciones = solicitudes.filter((s: ISolicitudAtencion)=> { return s.motivo == "POST VACACION" }).length
        this.nroMensajes = Number(this.preVacaciones) + Number(this.posVacaciones) 
			})
			.catch(err => { console.log(err) });
	}

  private async cantProximasCitas() {    
		await this.srvConsultaMedica.cantProximasCitas()
			.toPromise()
      .then(results => {
				this.proximasCitas = results ? results : 0;
        this.nroMensajes = Number(this.preVacaciones) + Number(this.posVacaciones) + Number(this.proximasCitas);
			})
			.catch(err => { console.log(err) });
	}

  async darAtencion(motivo: string){
    if (motivo=='FECHA'){
      const fechas = await this.srvConsultaMedica.fechasProximasCitas().toPromise();

      this.router.navigate([`serviciomedico/atenciones/fechas/${fechas.minfecha_prox_cita}/${fechas.maxfecha_prox_cita}`])
      .then(() => {
        window.location.reload();
      });
      return;
    }
    console.log(motivo);
    if (motivo!='FECHA'){
      this.router.navigate([`serviciomedico/solicitudes/motivo/${motivo}`])
      .then(() => {
        window.location.reload();
      })
      return;
    }
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }   

  cambioClase(){
    
    if (this.modoOscuro){
      sessionStorage.setItem('modoOscuro', "On")
      sessionStorage.setItem('classTable', "table table-striped table-dark")
    }
    else{
      sessionStorage.setItem('modoOscuro', "Off")
      sessionStorage.setItem('classTable', "table table-striped")
    }
    setTimeout(() => {
      this.reloadCurrentRoute();
    }, 1000);
    
  }  

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
        //console.log(currentUrl);
    });
  }

  Logout(){
    this.srvLoginService.logout();
    this.router.navigate(["serviciomedico/login"]);
  }

  imageExists(url): boolean {
    let http = new XMLHttpRequest(); 
    http.open('HEAD', url, false); 
    http.send(); 
    //console.log(http.status);
    if (http.status!=404)
      return true;
    else
      return false;
  }
}
