console.log('containers/layout-balanza/layout-balanza.component.ts');
import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import { Router } from '@angular/router';
/*import { LoginSecioMedicoService } from '../../services/servicio_medico/login-secio-medico.service';
import { ConsultasService } from '../../services/servicio_medico/consultas.service';
import { MedicosService } from '../../services/servicio_medico/medicos.service';
import { MenusService } from '../../services/servicio_medico/menu_serviciomedico.service';
import { IUsuarios } from '../../models/usuarios.model';
import { ItotalAtenciones } from '../../models/medicos.model';
 */
import { LoginBalanzaService } from "../../services/balanza/login-balanza.service";
import { ConsultasService } from "../../services/balanza/consultas.service";
import { Ioperador } from "../../models/balanza/operador.models";
import { MenusService } from '../../services/balanza/menu_balanza.service';


@Component({
  selector: 'app-layout-balanza',
  templateUrl: './layout-balanza.component.html'
})
export class LayoutBalanzaComponent {
  public sidebarMinimized = false;
  public navItems = navItems;
  public totalAtenciones: any;
  public sistemaActual: string;
  user: Ioperador={};
  soportesUser: Ioperador[]=[];
  nroMensajes: number=0;
  claseMensaje: string;
  imagenUser: string="";
 // private totalesAtenciones: ItotalAtenciones[]=[];
   totalGlobalAtenciones: number;

  constructor(
    private router: Router,
    private srvLoginService: LoginBalanzaService,
    private srvConsultaMedica: ConsultasService, 
    //private srvMedicos: MedicosService,
    //private srvMenuServicioMedico: MenusService,
    private srvMenuServicioBalanza: MenusService,
    ) {
      if (this.nroMensajes>0)
        this.claseMensaje="badge badge-pill badge-danger";
      else
        this.claseMensaje="badge badge-pill badge-info";

      if (sessionStorage.currentUser){ 
        this.user=JSON.parse(sessionStorage.currentUser);
        if (sessionStorage.sistemaActual=='Balanza'){
         // srvConsultaMedica.consultasCount(this.user.login).toPromise().then(resutl => { this.totalAtenciones=resutl});        
          //this.sistemaActual=sessionStorage.sistemaActual;        
          //console.log(this.user.operador);
          this.imagenUser= 'assets/img/avatars/' + this.user.operador + '.bmp';
          //console.log(this.imagenUser);
          if (this.imageExists(this.imagenUser)==false)
            this.imagenUser= 'assets/img/avatars/desconocido.png';

         /* this.srvMedicos.contadorAtenciones()
          .toPromise()
          .then( result => {
            
            this.totalesAtenciones = result; 
            
            this.srvMedicos.contadorTotalAtenciones().toPromise().then(resutl => { this.totalGlobalAtenciones=resutl});

            //this.srvLoginService.usuariosFiltrados(61).toPromise().then(resutl => { this.soportesUser=resutl});
            
          });*/
        }
      }else{ 
        this.router.navigate(["/"]);
      }      
    }

  ngOnInit(): void {
    this.navItems = [];       
    if (sessionStorage.sistemaActual=='Balanza'){      
      this.menusUsuarioBalanza(this.user.operador);
    }         
  }
    
  private async menusUsuarioBalanza(user: string) {    
		return await this.srvMenuServicioBalanza.menusUser(user)
			.toPromise()
      .then(results => {				
				this.navItems = results;				
			})			
			.catch(err => { console.log(err) });
	}

  toggleMinimize(e) {
    this.sidebarMinimized = e;
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
