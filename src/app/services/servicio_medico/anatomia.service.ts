import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IAnatomia, IExamenFuncional, IExamenesFuncionales } from '../../models/servicio-medico/anatomias.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnatomiasService {
  examenFuncional: IExamenFuncional={};
  
  private apiUrlExamenesFuncionales : string = environment.apiUrlServMedico + 'anatomias/';

  constructor(private http: HttpClient) { }

  anatomiasAll() : Observable<IAnatomia[]> { 

    return this.http.get<IAnatomia[]>(this.apiUrlExamenesFuncionales + 'consultar')
			.pipe(
				//tap(result => console.log(`anatomiasAll`)),
				catchError(this.handleError)
			);
  }

  anatomiasTipos() : Observable<{tipo: string}[]> { 

    return this.http.get<{tipo: string}[]>(this.apiUrlExamenesFuncionales + 'tipos')
			.pipe(
				//tap(result => console.log(`anatomiasTipos`)),
				catchError(this.handleError)
			);
  }

  anatomiasPorTipos(tipo: string) : Observable<IAnatomia[]> { 

    return this.http.get<IAnatomia[]>(this.apiUrlExamenesFuncionales + 'consultar/tipos/' + tipo)
			.pipe(
				//tap(result => console.log(`anatomiasTipos`)),
				catchError(this.handleError)
			);
  }
  
  examenesFuncionales(cedula: string) : Observable<IExamenFuncional[]> { 
    
    return this.http.get<IExamenFuncional[]>(this.apiUrlExamenesFuncionales + 'examenes/' + cedula )
			.pipe(
				//tap(result => console.log(`examenesFuncionales`)),
				catchError(this.handleError)
			);
  }

  registrar(reg: IExamenFuncional) {
    return this.http.post<IExamenFuncional>(this.apiUrlExamenesFuncionales + 'insertar', reg).pipe(
        tap(result => { this.examenFuncional = result; console.log(`examen insertado`) }),
        catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}