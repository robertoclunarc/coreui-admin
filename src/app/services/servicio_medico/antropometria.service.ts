import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Iantropometria } from '../../models/antropometria.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AntropometriaService {
    antropometria: Iantropometria={};
  
  private apiUrlantropometria : string = environment.apiUrlServMedico + 'antropometrias/';

  constructor(private http: HttpClient) { }

  antropometriaAll() : Observable<Iantropometria[]> { 

    return this.http.get<Iantropometria[]>(this.apiUrlantropometria + 'consultar')
			.pipe(
				tap(result => console.log(`antropometriaAll`)),
				catchError(this.handleError)
			);
  }

  antropometriaOne(cedula: string, fecha: string) : Observable<Iantropometria> { 

    return this.http.get<Iantropometria>(this.apiUrlantropometria + `consultar/${cedula}/${fecha}`)
			.pipe(
				tap(result => console.log(`antropometriaOne`)),
				catchError(this.handleError)
			);
  }

  registrar(reg: Iantropometria) {
    return this.http.post<Iantropometria>(this.apiUrlantropometria + 'insert', reg).pipe(
        tap(result => { this.antropometria = result; console.log(`antropometria insertada`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: Iantropometria) {
    const url = `${this.apiUrlantropometria}update/${reg.cedula}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(cedula: string) {
    const url = `${this.apiUrlantropometria}delete/${cedula}`;

    return this.http.delete(url).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}
