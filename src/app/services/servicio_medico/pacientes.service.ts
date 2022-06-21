import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IPaciente, IvPaciente } from '../../models/servicio-medico/paciente.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  paciente: IvPaciente={};
  
  private apiUrlPacientes : string = environment.apiUrlServMedico + 'pacientes/';

  constructor(private http: HttpClient) { }

  pacientesAll() : Observable<IPaciente[]> { 

    return this.http.get<IvPaciente[]>(this.apiUrlPacientes + 'consultar')
			.pipe(
				tap(result => console.log(`pacientesAll`)),
				catchError(this.handleError)
			);
  }

  pacienteOne(cedula: string) : Observable<IvPaciente> { 

    return this.http.get<IvPaciente>(this.apiUrlPacientes + 'consultar/cedula/' + cedula)
			.pipe(
				tap(result => console.log(`pacienteOne`)),
				catchError(this.handleError)
			);
  }
  
  pacienteUid(idPaciente: number) : Observable<IvPaciente> { 

    return this.http.get<IvPaciente>(this.apiUrlPacientes + 'consultar/uid/' + idPaciente)
			.pipe(
				tap(result => console.log(`pacienteUid`)),
				catchError(this.handleError)
			);
  }

  registrar(reg: IPaciente) {
    return this.http.post<IPaciente>(this.apiUrlPacientes + 'insert', reg).pipe(
        tap(result => { this.paciente = result; console.log(`paciente insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IPaciente) {
    const url = `${this.apiUrlPacientes}update/${reg.uid_paciente}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlPacientes}delete/${id}`;

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