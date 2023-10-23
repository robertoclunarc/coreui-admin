import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IEstudiosFisico, IExamenFisico, IExamenesFisicosPacientes } from '../../models/servicio-medico/estudiofisico.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstudiosFisicosService {
  EstudiosFisicos:IExamenFisico={};
  
  private apiUrlEstudiosFisicos : string = environment.apiUrlServMedico + 'estudiosfisicos/';

  constructor(private http: HttpClient) { }

  EstudiosFisicosAll() : Observable<IEstudiosFisico[]> { 

    return this.http.get<IEstudiosFisico[]>(this.apiUrlEstudiosFisicos + 'consultar')
			.pipe(
			//	tap(result => console.log(`EstudiosFisicosAll`)),
				catchError(this.handleError)
			);
  }

  EstudiosFisicosPorCedula(cedula: string) : Observable<IExamenesFisicosPacientes[]> { 

    return this.http.get<IExamenesFisicosPacientes[]>(this.apiUrlEstudiosFisicos + 'pacientes/' + cedula)
			.pipe(
			//	tap(result => console.log(`EstudiosFisicosPorCedula`)),
				catchError(this.handleError)
			);
  }  

  registrar(reg: IExamenFisico) {
    return this.http.post<IExamenFisico>(this.apiUrlEstudiosFisicos + 'insertar', reg).pipe(
      //  tap(result => { this.EstudiosFisicos = result; console.log(`EstudiosFisicos insertado`) }),
        catchError(this.handleError)
    );
  }
/*
  actualizar(reg: IEstudiosFisicosPaciente) {
    const url = `${this.apiUrlEstudiosFisicos}update/${reg.cedula}/${reg.fk_fisico}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
*/
  eliminarPorCedula(cedula: string) {
    const url = `${this.apiUrlEstudiosFisicos}delete/${cedula}`;
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