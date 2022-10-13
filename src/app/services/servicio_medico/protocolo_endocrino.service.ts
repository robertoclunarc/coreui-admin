import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IEvaluaciones_endocrinas, IPosibles_resp_endocrinas, IProtocolosEndrocrinos, IRespuestas_pacientes_eval_endocrino , IvProtocoloEndrocrinos } from '../../models/servicio-medico/protocolo_endocrino.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProtocolosEndocrinosService {
  respuesta: IRespuestas_pacientes_eval_endocrino={};
  protocolo: IProtocolosEndrocrinos={};
  private apiUrlProtocolo : string = environment.apiUrlServMedico + 'protocolo/endocrino/';

  constructor(private http: HttpClient) { }

  evaluacionesEndocrinasAll() : Observable<IEvaluaciones_endocrinas[]> { 

    return this.http.get<IEvaluaciones_endocrinas[]>(this.apiUrlProtocolo + 'consultar/evaluaciones/all')
			.pipe(
			//	tap(result => console.log(`AfeccionesAll`)),
				catchError(this.handleError)
			);
  }

  evaluacionesEndocrinasAllxTipo() : Observable<{tipoevaluacion: string, index: number, cantItem: number}[]> { 

    return this.http.get<{tipoevaluacion: string, index: number, cantItem: number}[]>(this.apiUrlProtocolo + 'consultar/evaluaciones/all' )
			.pipe(
			//	tap(result => console.log(`afeccionOne`)),
				catchError(this.handleError)
			);
  }

  posiblesRespEndocrinasAll() : Observable<IPosibles_resp_endocrinas[]> { 

    return this.http.get<IPosibles_resp_endocrinas[]>(this.apiUrlProtocolo + 'consultar/respuestas/all' )
			.pipe(
			//	tap(result => console.log(`afeccionOne`)),
				catchError(this.handleError)
			);
  }

  respuestasPacientesEvalEndocrino(fkPaciente: string, fkProtocolo: string) : Observable<IRespuestas_pacientes_eval_endocrino[]> { 

    return this.http.get<IRespuestas_pacientes_eval_endocrino[]>(this.apiUrlProtocolo + `consultar/respuestas/${fkPaciente}/${fkProtocolo}` )
			.pipe(
			//	tap(result => console.log(`afeccionOne`)),
				catchError(this.handleError)
			);
  }
  
  consultaFilter(ciPaciente: string, idProtocolo: string, fechaIni: string, fechaFin: string, medico: string, uidPaciente: string, condlogica: string) : Observable<IvProtocoloEndrocrinos[]> { 
    let parametrosUrl = `${ciPaciente}/${idProtocolo}/${fechaIni}/${fechaFin}/${medico}/${uidPaciente}/${condlogica}`
    return this.http.get<IvProtocoloEndrocrinos[]>(this.apiUrlProtocolo + 'filtrar/' + parametrosUrl )
			.pipe(
			//	tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  createRecordProtocoloEndocrino(reg: IProtocolosEndrocrinos) {
    return this.http.post<IProtocolosEndrocrinos>(this.apiUrlProtocolo + 'insertar', reg).pipe(
        tap(result => { this.protocolo = result; console.log(`Protocolo insertado`) }),
        catchError(this.handleError)
    );
  }

  createRecordRespProtEndocrino(reg: IRespuestas_pacientes_eval_endocrino) {
    return this.http.post<IRespuestas_pacientes_eval_endocrino>(this.apiUrlProtocolo + 'insertar', reg).pipe(
        tap(result => { this.protocolo = result; console.log(`Protocolo insertado`) }),
        catchError(this.handleError)
    );
  }

  updateRecordRespProtEndocrino(reg: IRespuestas_pacientes_eval_endocrino) {
    const url = `${this.apiUrlProtocolo}update/respuesta/${reg.idresp}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  updateRecordProtocoloEndocrino(reg: IProtocolosEndrocrinos) {
    const url = `${this.apiUrlProtocolo}update/${reg.idprotocolo}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  deleteRecordProtocolosEndrocrinos(id: number) {
    const url = `${this.apiUrlProtocolo}delete/${id}`;

    return this.http.delete(url).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  deleteRecordRespProtEndocrino(id: number) {
    const url = `${this.apiUrlProtocolo}delete/respuesta/${id}`;

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