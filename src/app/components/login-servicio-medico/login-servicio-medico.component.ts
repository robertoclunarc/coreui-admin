import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginSecioMedicoService } from '../../services/login-secio-medico.service';
import { IUsuarios } from '../../models/usuarios.model';

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
    
		this.authenticationService.loguear(this.model.login , this.model.passw)
			.toPromise()
			.then(results => {
				
					this.user = results; 
          if (this.user && this.user.estatus != 'ACTIVO') {
            
            this.loading = false;
            this.error = 'Usuario Inactivo';
            return;
          }
          const currentUser = sessionStorage.getItem('currentUser');
          
          if (!currentUser) {
              this.loading = false;
              this.error = 'Usuario no Autenticado';
              return;
          }
          this.router.navigate(['/principal']);
				
			})
			.catch(err => { 
        this.error = err;
        this.loading = false;
        console.log(err) });
	}

}
