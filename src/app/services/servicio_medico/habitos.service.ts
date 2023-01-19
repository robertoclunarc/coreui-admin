import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IHabito, IHabitoPaciente, IvHabitos } from '../../models/servicio-medico/habitos.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabitosService {
  habito: IHabitoPaciente={};
  
  private apiUrlHabito : string = environment.apiUrlServMedico + 'habitos/';

  constructor(private http: HttpClient) { }

  habitosAll() : Observable<IHabito[]> { 

    return this.http.get<IHabito[]>(this.apiUrlHabito + 'consultar')
			.pipe(
			//	tap(result => console.log(`HabitosAll`)),
				catchError(this.handleError)
			);
  }

  habitosPorCedula(cedula: string) : Observable<IvHabitos[]> { 

    return this.http.get<IvHabitos[]>(this.apiUrlHabito + 'pacientes/' + cedula)
			.pipe(
		//		tap(result => console.log(`habitosPorCedula`)),
				catchError(this.handleError)
			);
  }  
  

  registrar(reg: IHabitoPaciente) {
    return this.http.post<IHabitoPaciente>(this.apiUrlHabito + 'insertar', reg).pipe(
        tap(result => { this.habito = result; console.log(`habito insertado`) }),
        catchError(this.handleError)
    );
  }
/*
  actualizar(reg: IHabitoPaciente) {
    const url = `${this.apiUrlHabito}update/${reg.cedula}/${reg.fk_habito}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
*/
  eliminarPorCedula(cedula: string) {
    const url = `${this.apiUrlHabito}delete/${cedula}`;

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