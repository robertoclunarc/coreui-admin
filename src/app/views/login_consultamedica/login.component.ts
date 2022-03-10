import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//import 'rxjs/add/operator/first';
import { LoginSecioMedicoService } from '../../services/login-secio-medico.service';
import { IUsuarios } from '../../models/usuarios.model';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginServicioMedicoComponent implements OnInit { 
  loading: boolean = false;
  model: any = {};
  user: IUsuarios;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: LoginSecioMedicoService,
    ) { }

  ngOnInit() {
      this.authenticationService.logout();
  }

  login() {

    this.loading = true;
    console.log(this.model.login);
    this.authenticationService.loguear( this.model.login , this.model.passw)        
        .subscribe(
            data => {
                this.user = data[0];
                console.log(this.user);
                if (this.user && this.user.estatus != 'ACTIVO') {
                    console.log(this.user.estatus);
                    this.loading = false;
                    this.error = 'Usuario Inactivo';
                    return;
                }

                //this.srvBreakCrumb.set("idMenuBreakCrumb", 1);
                //this.router.navigate(['/noticias']);
                const currentUser = sessionStorage.getItem('currrentUser');
                console.log(sessionStorage.getItem('currrentUser'));
                console.log(currentUser);
                if (!currentUser) {
                    this.loading = false;
                    this.error = 'Usuario no Autenticado';
                }
            },
            error => {
                this.error = error;
                this.loading = false;
            });
  }

}
