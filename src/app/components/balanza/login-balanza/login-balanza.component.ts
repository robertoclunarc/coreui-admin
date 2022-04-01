console.log('components/Balanza/login-balanza/login-balanza.component.ts');
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginBalanzaService } from '../../../services/balanza/login-balanza.service';
import { Ioperador } from '../../../models/balanza/operador.models';
import { Itoken } from '../../../models/token.model';
//*********************************/
import swal from "sweetalert2";
@Component({
  selector: 'app-login-balanza',
  templateUrl: './login-balanza.component.html',
  providers: [LoginBalanzaService],
  //styleUrls: ['./logig-balanza-componets.scss']
  //styleUrls: ['./login-servicio-medico.component.scss']
})
export class LoginBalanzaComponent implements OnInit {
  loading: boolean = false;
  model: any = {};
  user: Itoken = {};
  error: string = '';
  titularAlerta:String;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: LoginBalanzaService,
  ) { }

  ngOnInit(): void {
    this.authenticationService.logout();
  }
  
  loguear() {
    //console.log("pago");
		this.authenticationService.loguear(this.model.login , this.model.passw)
			.toPromise()
			.then(results => {

					this.user = results;
          //console.log('Resultado1: '); 
          //console.log(results); 
          //console.log('Resultado2: '); 
          //console.log(results['usuario'][0].statusOperador); 
          
          //this.usuario  = results;
          //const status = results.statusOperador;
          //console.log(status);          
          
          
          if (this.user && this.user.user.statusOperador != 1) {
          //if (this.user && results['usuario'][0].statusOperador != 1) {
           // if ( results.user.statusOperador != 1) {
            swal.fire(
              'Usuario Inactivo',
              '',
              'error'
            )
            this.loading = false;
            this.error = 'Usuario Inactivo';
            console.log(this.error)
            return;
          }
          //console.log('paso');
          //console.log(sessionStorage.getItem('currentUser'));
          const currentUser = sessionStorage.getItem('currentUser');
          //console.log(currentUser);
          if (!currentUser) {
              this.loading = false;
              this.error = 'Usuario no Autenticado';
              return;
          }
          swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario autenticado',
            showConfirmButton: true,
            timer: 1500
          })
          sessionStorage.setItem('sistemaActual', 'Balanza');
          this.router.navigate(['/principalBalanza']);
				
			})
			.catch(err => { 
        swal.fire(
          err,
          'Usuario NO registrado',
          'error'
        )
        this.error = err;
        this.loading = false;
        console.log(err) 
      });
	}
  

}
