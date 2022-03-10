import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IUsuarios } from '../models/usuarios.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginSecioMedicoService {
  user: IUsuarios={};
  private apiUrlLogin : string = environment.apiUrlServMedico + 'login';

  constructor(private http: HttpClient) { }

  usuariosFiltrados(departamento: number) : Observable<IUsuarios[]> {

      return this.http.get<IUsuarios[]>(`${this.apiUrlLogin}/usuarios/filtrados/${departamento}`)
			.pipe(
				tap(result => console.log(`usuariosFiltrados`)),
				catchError(this.handleError)
			);
  }

  loguear(username: string, password: string): Observable<IUsuarios> {
		
		return this.http.post<IUsuarios>(this.apiUrlLogin , { login: username, passw: password })
			.pipe(
				tap(result => { 
          
          if (JSON.stringify(result).length>2) {
            console.log(JSON.stringify(result));
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(result));
            
            this.user=JSON.parse(sessionStorage.currentUser);
            sessionStorage.setItem('tipoUser', this.tipoUser(this.user))
          }
        }),
				catchError(this.handleError)
			);
	}

  tipoUser(user: IUsuarios): string{
    if (user) {      
      if (user.fkdepartamento==61 && this.user.nivel==1) {
        return "SISTEMA"
      } 
      else      
        if (user.fkdepartamento==71 && this.user.nivel==1) {
          return "MEDICO"
        }
        else      
          if (user.fkdepartamento==71 && this.user.nivel==2) {
            return "PARAMEDICO"
          }
          else
            if (user.fkdepartamento==71 && this.user.nivel==2) {
              return "PARAMEDICO"
            }
            else
              return "ADMINISTRATIVO"
    }
    return "NINGUNO";
  }  

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }       

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
