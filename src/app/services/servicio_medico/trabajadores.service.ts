import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ITrabajadores } from '../../models/servicio-medico/trabajadores.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrabajadoresService {
  trabajador: ITrabajadores={};
  
  private apiUrlTrabajadores : string = environment.apiUrlServMedico + 'trabajadores/';

  constructor(private http: HttpClient) { }

  trabajadoresAll() : Observable<ITrabajadores[]> {
    return this.http.get<ITrabajadores[]>(this.apiUrlTrabajadores + 'consultar')
        .pipe(
        //	tap(result => console.log(`pacientesAll`)),
            catchError(this.handleError)
        );
  }

  trabajadoresOne(cedula: string) : Observable<ITrabajadores> {
    return this.http.get<ITrabajadores>(this.apiUrlTrabajadores + 'consultar/cedula/' + cedula)
        .pipe(
            tap(),
            catchError(this.handleError)
        );
  } 

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}