import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IUsuarios } from '../models/usuarios';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginSecioMedicoService {
  user: IUsuarios={};
  private apiUrlLogin : string = environment.apiUrlServMedico + 'login';

  constructor(private http: HttpClient) { }

  login(username: string, password: string) : Observable<IUsuarios> { 

    return this.http.post<IUsuarios>(this.apiUrlLogin , { login: username, passw: password })
        .pipe(user => {
            console.log(user);
            if (JSON.stringify(user).length>2) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('currentUser', JSON.stringify(user[0]));
            }
            return user;
        });
  }

  loguear(username: string, password: string): Observable<IUsuarios> {
		
		return this.http.post<IUsuarios>(this.apiUrlLogin , { login: username, passw: password })
			.pipe(
				tap(result => { 
          
          if (JSON.stringify(result).length>2) {
            console.log(JSON.stringify(result));
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(result));
            
          }
        }),
				catchError(this.handleError)
			);
	}

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || 'server Error');
  }
}
