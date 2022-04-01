console.log('services/login-balanza.service.ts');
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Ioperador } from '../../models/balanza/operador.models';
import { Itoken } from '../../models/token.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginBalanzaService {
   user: Ioperador={};
  private apiUrlLogin : string = environment.apiUrlBalanza + 'Auth/login'

  constructor(private http: HttpClient) { }

  loguear(username: string, password: string): Observable<Itoken>{
		 return this.http.post<Itoken>(this.apiUrlLogin , { login: username, passw: password })
			.pipe(
				tap(result => { 
          if (JSON.stringify(result).length>2) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(result.user ));
            this.user=JSON.parse(sessionStorage.currentUser);
            const token = localStorage.getItem('auth_token');
          }
        }),
				catchError(this.handleError)
			); 
	}

  
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }       

  handleError(error: HttpErrorResponse) {
    let mensaje='';
    if (error.status==501){  mensaje = 'Usuario Vacio'; } else
    if (error.status==502){  mensaje = 'Password Vacio'; } else
    if (error.status==400){  mensaje = 'Clave invalida'; } else
    if (error.status==401){  mensaje = 'No se pudo crear el token'; } 
   // console.log(error.status);
    //return throwError(error.message || 'server Error');
    return throwError(mensaje);
  }
}
 
