import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IConsultas, IConsultasConstraint, IFiltroConsulta, IvConsulta } from '../../models/consultas.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

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

  consultasCount(login: string) : Observable<number> { 

    return this.http.get<number>(this.apiUrlConsultas + 'consultar/atenciones/' + login);
  }

  consultaFilter(atencion: IFiltroConsulta) : Observable<IvConsulta[]> { 
    let parametrosUrl = atencion.ciPaciente + '/' + atencion.uidConsulta + '/' + atencion.fechaIni + '/' + atencion.fechaFin + '/' + atencion.Medico + '/' + atencion.Paramedico + '/' + atencion.Motivo + '/' + atencion.uidMotivo  + '/' + atencion.nombrePaciente + '/' + atencion.cargo  + '/' + atencion.fecha; 
    return this.http.get<IvConsulta[]>(this.apiUrlConsultas + 'filtrar/' + parametrosUrl )
			.pipe(
				tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  async searchConsultaPromise(atencion: IFiltroConsulta) :  Promise<IvConsulta[]> { 
    let parametrosUrl = atencion.ciPaciente + '/' + atencion.uidConsulta + '/' + atencion.fechaIni + '/' + atencion.fechaFin + '/' + atencion.Medico + '/' + atencion.Paramedico + '/' + atencion.Motivo + '/' + atencion.uidMotivo  + '/' + atencion.nombrePaciente + '/' + atencion.cargo + '/' + atencion.fecha; 
    return await this.http.get<IvConsulta[]>(this.apiUrlConsultas + 'filtrar/' + parametrosUrl ).toPromise();
  }

  consultasPorMotivos() : Observable<{id_motivo, descripcion, totalmotivos }[]> { 

    return this.http.get<{id_motivo, descripcion, totalmotivos }[]>(this.apiUrlConsultas + 'motivos')
			.pipe(
				tap(result => console.log(`consultasPorMotivos (${result.length})`)),
				catchError(this.handleError)
			);
  }

  countAtencionPorMotivosMedicos(login: string, tipoMedico: string ) : Observable<{id_motivo:number, descripcion: string, totalmotivos:number }[]> { 

    return this.http.get<{id_motivo:number, descripcion: string, totalmotivos:number}[]>(this.apiUrlConsultas + `motivos/medicos/${login}/${tipoMedico}`)
			.pipe(
				tap(result => console.log(`countAtencionPorMotivosMedicos (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasPorMotivosDelAnio() : Observable<{id_motivo, descripcion, diamesanio, cantmotivos }[]> { 

    return this.http.get<{id_motivo, descripcion, diamesanio, cantmotivos }[]>(this.apiUrlConsultas + 'motivos/delanio')
			.pipe(
				tap(result => console.log(`consultasPorMotivosDelAnio (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasAfecciones() : Observable<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number }[]> { 

    return this.http.get<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number}[]>(this.apiUrlConsultas + 'afecciones')
			.pipe(
				tap(result => console.log(`consultasAfecciones (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasAfeccionesMeses() : Observable<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number }[]> { 

    return this.http.get<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number}[]>(this.apiUrlConsultas + 'afecciones/meses')
			.pipe(
				tap(result => console.log(`consultasAfeccionesMeses (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasAfeccionesAnios() : Observable<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number }[]> { 

    return this.http.get<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number}[]>(this.apiUrlConsultas + 'afecciones/anios')
			.pipe(
				tap(result => console.log(`consultasAfeccionesAnios (${result.length})`)),
				catchError(this.handleError)
			);
  }
  
  consultasAfeccionesAll(interval: string) : Observable<{ fkafeccion: number, cantafeccion: number }[]> { 

    return this.http.get<{ fkafeccion: number, cantafeccion: number}[]>(this.apiUrlConsultas + `afecciones/all/${interval}`)
			.pipe(
				tap(result => console.log(`consultasAfeccionesAll (${result.length})`)),
				catchError(this.handleError)
			);
  }

  countResultadoEvalParamedicos(login: string) : Observable<{ id_paramedico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number }[]> { 

    return this.http.get<{ id_paramedico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number}[]>(this.apiUrlConsultas + `resultadoevaluacion/paramedicos/${login}`)
			.pipe(
				tap(result => console.log(`consultasAfeccionesAll (${result.length})`)),
				catchError(this.handleError)
			);
  }

  countResultadoEvalMedicos(login: string) : Observable<{ id_medico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number }[]> { 

    return this.http.get<{ id_medico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number}[]>(this.apiUrlConsultas + `resultadoevaluacion/medicos/${login}`)
			.pipe(
				tap(result => console.log(`consultasAfeccionesAll (${result.length})`)),
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