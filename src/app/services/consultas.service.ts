import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IConsultas, IConsultasConstraint, IFiltroConsulta, IvConsulta } from '../models/consultas.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  consulta: IConsultas={};
  
  private apiUrlConsultas : string = environment.apiUrlServMedico + 'consultas/';

  constructor(private http: HttpClient) { }

  consultasAll() : Observable<IConsultas[]> { 

    return this.http.get<IConsultas[]>(this.apiUrlConsultas + 'consultar')
			.pipe(
				tap(result => console.log(`consultasAll`)),
				catchError(this.handleError)
			);
  }

  consultasOne(id: number) : Observable<IConsultas> { 

    return this.http.get<IConsultas>(this.apiUrlConsultas + 'consultar/' + id)
			.pipe(
				tap(result => console.log(`consultasOne`)),
				catchError(this.handleError)
			);
  }

  consultaFilter(atencion: IFiltroConsulta) : Observable<IvConsulta[]> { 
    let parametrosUrl = atencion.uidPaciente + '/' + atencion.uidConsulta + '/' + atencion.fechaIni + '/' + atencion.fechaFin + '/' + atencion.ciMedico + '/' + atencion.ciParamedico + '/' + atencion.uidMotivo;
    return this.http.get<IvConsulta[]>(this.apiUrlConsultas + 'filtrar/' + parametrosUrl )
			.pipe(
				tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  registrar(consulta: IConsultas) {
    return  this.http.post<IConsultas>(this.apiUrlConsultas + 'insert', consulta).pipe(
        tap(result => { this.consulta = result; console.log(`Consulta insertada`) }),
        catchError(this.handleError)
    );
  }

  async nuevo(consulta: IConsultas): Promise<IConsultas> {
    return await this.http.post<IConsultas>(this.apiUrlConsultas + 'insert', consulta).toPromise();    
    
  }

  actualizar(consulta: IConsultas) {
    const url = `${this.apiUrlConsultas}update/${consulta.uid}`;

    return this.http.put(url, consulta).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlConsultas}delete/${id}`;

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
