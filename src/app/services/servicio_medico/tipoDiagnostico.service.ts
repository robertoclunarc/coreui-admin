import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ItipoDiagnostico } from '../../models/servicio-medico/tipoDiagnostico.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DiagnosticosService {
  tipoDiagnostico: ItipoDiagnostico={};
  
  private apiUrlDiagnotico : string = environment.apiUrlServMedico + 'diagnosticos/';

  constructor(private http: HttpClient) { }

  tiposDiagnosticosAll() : Observable<ItipoDiagnostico[]> { 

    return this.http.get<ItipoDiagnostico[]>(this.apiUrlDiagnotico + 'tipos/consultar')
			.pipe(
			//	tap(result => console.log(`AfeccionesAll`)),
				catchError(this.handleError)
			);
  }

  registrar(reg: ItipoDiagnostico) {
    return this.http.post<ItipoDiagnostico>(this.apiUrlDiagnotico + 'tipos/insert', reg).pipe(
        tap(result => { this.tipoDiagnostico = result; console.log(`tipo Diagnostico insertado`) }),
        catchError(this.handleError)
    );
  }  

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}