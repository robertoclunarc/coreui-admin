import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IAnalisisPsicologico, IEstudioPsicologico, IAnamnesisPsicologico  } from '../../models/servicio-medico/anamnesispsicologico.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnamnesisPsicologicoService {
  analisissPaciente: IAnalisisPsicologico={};
  
  private apiUrlEstudiosPsicologicos : string = environment.apiUrlServMedico + 'estudiospsicologicos/';

  constructor(private http: HttpClient) { }

  estudiosPsicologicosAll() : Observable<IEstudioPsicologico[]> { 

    return this.http.get<IEstudioPsicologico[]>(this.apiUrlEstudiosPsicologicos + 'consultar')
			.pipe(
				//tap(result => console.log(`estudiosPsicologicosAll`)),
				catchError(this.handleError)
			);
  }

  estudiosPsicologicosPorCedula(cedula: string) : Observable<IAnamnesisPsicologico[]> { 

    return this.http.get<IAnamnesisPsicologico[]>(this.apiUrlEstudiosPsicologicos + 'pacientes/' + cedula)
			.pipe(
			//	tap(result => console.log(`estudiosPsicologicosPorCedula`)),
				catchError(this.handleError)
			);
  }  
  

  registrar(reg: IAnalisisPsicologico) {
    return this.http.post<IAnalisisPsicologico>(this.apiUrlEstudiosPsicologicos + 'insertar', reg).pipe(
        tap(result => { this.analisissPaciente = result; console.log(`Estudio insertado`) }),
        catchError(this.handleError)
    );
  }
/*
  actualizar(reg: IAnalisisPsicologico) {
    const url = `${this.apiUrlEstudiosPsicologicos}update/${reg.cedula}/${reg.fk_estudio}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
*/
  eliminarPorCedula(cedula: string) {
    const url = `${this.apiUrlEstudiosPsicologicos}delete/${cedula}`;

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