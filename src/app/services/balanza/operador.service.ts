import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IMedicos, IParamedicos, ItotalAtenciones } from '../../models/medicos.model';
import { Ioperador} from '../../models/balanza/operador.models';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalanzaService {  
  public medico: Ioperador;
  //public paraMedico: IParamedicos;
  private apiUrlMedicos : string = environment.apiUrlServMedico + 'personal/';
  
  constructor(private http: HttpClient) { }

  medicosAll() : Observable<Ioperador[]> { 

    return this.http.get<Ioperador[]>(this.apiUrlMedicos + 'medicos/consultar')
			.pipe(
				tap(result => console.log(`medicosAll`)),
				catchError(this.handleError)
			);
  }

  paraMedicosAll() : Observable<Ioperador[]> { 

    return this.http.get<Ioperador[]>(this.apiUrlMedicos + 'paramedicos/consultar')
			.pipe(
				tap(result => console.log(`paramedicosAll`)),
				catchError(this.handleError)
			);
  }

  contadorAtenciones() : Observable<ItotalAtenciones[]> { 
    
    return this.http.get<ItotalAtenciones[]>(this.apiUrlMedicos + 'paramedicos/medicos/atenciones')
			.pipe(
				tap(result => console.log(`contadorAtenciones`)),
				catchError(this.handleError)
			);
  }

  contadorTotalAtenciones() : Observable<number> { 
    
    return this.http.get<number>(this.apiUrlMedicos + 'paramedicos/medicos/atenciones/total')
			.pipe(
				tap(result => console.log(`contadorTotalAtenciones:${result}`)),
				catchError(this.handleError)
			);
  }
/*
  medicosOne(id: number) : Observable<Ioperador> { 

    return this.http.get<Ioperador>(this.apiUrlMedicos + 'medicos/consultar/' + id)
			.pipe(
				tap(result => console.log(`medicosOne`)),
				catchError(this.handleError)
			);
  } 
  */
 /*
  paraMedicosOne(id: number) : Observable<Ioperador> { 

    return this.http.get<IParamedicos>(this.apiUrlMedicos + 'paramedicos/consultar/' + id)
			.pipe(
				tap(result => console.log(`paramedicosOne`)),
				catchError(this.handleError)
			);
  }
  /
*/
/*
  registrarMedico(reg: Ioperador) {
    return this.http.post<Ioperador>(this.apiUrlMedicos + 'medicos/insert', reg).pipe(
        tap(result => { this.medico = result; console.log(`medico insertado`) }),
        catchError(this.handleError)
    );
  }
*/
/*
  registrarParaMedico(reg: IParamedicos) {
    return this.http.post<IParamedicos>(this.apiUrlMedicos + 'paramedicos/insert', reg).pipe(
        tap(result => { this.paraMedico = result; console.log(`paramedico insertado`) }),
        catchError(this.handleError)
    );
  }
*/
/*
  actualizarMedico(reg: Ioperador) {
    const url = `${this.apiUrlMedicos}/medicos/update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
*/
/*
  actualizarParaMedico(reg: IParamedicos) {
    const url = `${this.apiUrlMedicos}/paramedicos/update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
*/
/*
  eliminarMedico(id: number) {
    const url = `${this.apiUrlMedicos}/medicos/delete/${id}`;

    return this.http.delete(url).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
*/
/*
  eliminarParamedico(id: number) {
    const url = `${this.apiUrlMedicos}/paramedicos/delete/${id}`;

    return this.http.delete(url).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
*/
  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}
