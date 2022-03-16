import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IsignosVitales } from '../../models/signos_vitales.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService {
    signosVitales: IsignosVitales={};
  
  private apiUrlSignosVitales : string = environment.apiUrlServMedico + 'signosvitales/';

  constructor(private http: HttpClient) { }

  signosVitalesAll() : Observable<IsignosVitales[]> { 

    return this.http.get<IsignosVitales[]>(this.apiUrlSignosVitales + 'consultar')
			.pipe(
				tap(result => console.log(`signosVitalesAll`)),
				catchError(this.handleError)
			);
  }

  signosVitalesOne(cedula: string, fecha: string) : Observable<IsignosVitales> { 

    return this.http.get<IsignosVitales>(this.apiUrlSignosVitales + `consultar/${cedula}/${fecha}`)
			.pipe(
				tap(result => console.log(`signosVitalesOne`)),
				catchError(this.handleError)
			);
  }

  registrar(reg: IsignosVitales) {
    return this.http.post<IsignosVitales>(this.apiUrlSignosVitales + 'insert', reg).pipe(
        tap(result => { this.signosVitales = result; console.log(`Signos Vitales insertados`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IsignosVitales) {
    const url = `${this.apiUrlSignosVitales}update/${reg.cedula}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(cedula: string) {
    const url = `${this.apiUrlSignosVitales}delete/${cedula}`;

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