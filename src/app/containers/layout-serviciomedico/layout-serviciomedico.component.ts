import { Component} from '@angular/core';
import { navItems } from '../../_nav';
import { NavigationEnd, Router } from '@angular/router';
import { LoginSecioMedicoService } from '../../services/servicio_medico/login-secio-medico.service';
import { ConsultasService } from '../../services/servicio_medico/consultas.service';
import { MedicosService } from '../../services/servicio_medico/medicos.service';
import { MenusService } from '../../services/servicio_medico/menu_serviciomedico.service';
import { IUsuarios } from '../../models/usuarios.model';
import { ItotalAtenciones } from '../../models/medicos.model';
 
@Component({
  selector: 'app-layout-serviciomedico',
  templateUrl: './layout-serviciomedico.component.html'
})
export class LayoutServicioMedicoComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public totalAtenciones: any;
  public sistemaActual: string;
  private user: IUsuarios={};
  private soportesUser: IUsuarios[]=[];
  private nroMensajes: number=0;
  private claseMensaje: string;
  private imagenUser: string="";
  private totalesAtenciones: ItotalAtenciones[]=[];
  private totalGlobalAtenciones: number;
  public modoOscuro: boolean;
  
  constructor(
    private router: Router,
    private srvLoginService: LoginSecioMedicoService,
    private srvConsultaMedica: ConsultasService, 
    private srvMedicos: MedicosService,
    private srvMenuServicioMedico: MenusService,
    ) {
        if (this.nroMensajes>0)
          this.claseMensaje="badge badge-pill badge-danger";
        else
          this.claseMensaje="badge badge-pill badge-info";

        if (sessionStorage.currentUser){ 
          this.user=JSON.parse(sessionStorage.currentUser);
          if (sessionStorage.sistemaActual=='ServicioMedico'){
            srvConsultaMedica.consultasCount(this.user.login).toPromise().then(resutl => { this.totalAtenciones=resutl});        
            this.sistemaActual=sessionStorage.sistemaActual;        
            
            this.imagenUser= 'assets/img/avatars/' + this.user.login + '.bmp';
            
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
  }  
    
  private async menusUsuarioServicioMedico(user: string) {    
		return await this.srvMenuServicioMedico.menusUser(user)
			.toPromise()
      .then(results => {				
				this.navItems = results;				
			})			
			.catch(err => { console.log(err) });
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
    this.reloadCurrentRoute();
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
    this.router.navigate(["login"]);
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
