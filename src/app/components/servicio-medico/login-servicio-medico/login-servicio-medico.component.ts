import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginSecioMedicoService } from '../../../services/servicio_medico/login-secio-medico.service';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';

@Component({
  selector: 'app-login-servicio-medico',
  templateUrl: './login-servicio-medico.component.html',
  providers: [LoginSecioMedicoService],
  //styleUrls: ['./login-servicio-medico.component.scss']
})
export class LoginServicioMedicoComponent implements OnInit {
  loading: boolean = false;
  model: any = {};
  user: IUsuarios = {};
  error: string = '';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: LoginSecioMedicoService,
  ) { }

  ngOnInit(): void {
    this.authenticationService.logout();
  }
  
  loguear() {
    this.error = '';
    this.loading = true;
    let message1: { text?: string, access?: boolean} = {};
    let message2: { text?: string, access?: boolean} = {};
		this.authenticationService.loguear(this.model.login , this.model.passw)
			.toPromise()
			.then(async results => {
          message1 = await this.validarUsuario(results);                   
          if(!message1.access && message1.text=='Usuario No Encontrado'){
            
            let userAsistenciaLaboral: IUsuarios = await this.loguearAsistenciaLaboral(this.model.login , this.model.passw);
            message2 = await this.validarUsuario(userAsistenciaLaboral);
            
            if (!message2.access){              
              this.loading =  message2.access;
              this.error = message2.text;
              return;
            }
            else{
              this.user = userAsistenciaLaboral;
            }
          }
           
          const currentUser = sessionStorage.getItem('currentUser');
          
          if (!currentUser) {            
            this.loading = false;
            this.error = 'Consulte con el Soporte Tecnico';
            return;
          }          
          
          sessionStorage.setItem('sistemaActual', 'ServicioMedico');
          if (message1.access){ 
            this.user = results;            
            this.router.navigate(['serviciomedico/principal']);
          }else{            
            this.router.navigate(['serviciomedico/solicitud']);
          }				
			})
			.catch(err => { 
        this.error = err;
        this.loading = false;
        console.error(err) 
      });
	}

  async loguearAsistenciaLaboral(login: string, passw: string) {
    let userAsistenciaLaboral: IUsuarios ={};
		userAsistenciaLaboral = await this.authenticationService.loguearAsistenciaLaboral(login , passw).toPromise();
    return userAsistenciaLaboral;
	}

  async validarUsuario(loginResult: any){
    let message: { text?: string, access?: boolean} = { text: 'Accediendo', access: true};
    if (loginResult?.error) {      
      message = {
        text: loginResult?.error,
        access: false,
      }
    }
    
    if (loginResult?.login && loginResult?.estatus?.toUpperCase() != 'ACTIVO') {
      message = {
        text: 'Usuario Inactivo',
        access: false,
      }
    }

    return message;
    
  }

}
