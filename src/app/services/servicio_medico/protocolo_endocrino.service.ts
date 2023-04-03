import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { filtroProtoEndocrino, IEvaluaciones_PosibleResp, IEvaluaciones_endocrinas, IPosibles_resp_endocrinas, IProtocolosEndrocrinos, IRespuestas_pacientes_eval_endocrino , IvProtocoloEndrocrinos } from '../../models/servicio-medico/protocolo_endocrino.model';
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

  async evaluacionesEndocrinasAll() : Promise<IEvaluaciones_endocrinas[]> { 

    return await this.http.get<IEvaluaciones_endocrinas[]>(this.apiUrlProtocolo + 'consultar/evaluaciones/all').toPromise();
			
  }

  async evaluacionesEndocrinasAllxTipo() : Promise<{tipoevaluacion: string, index: number, cantItem: number}[]> { 

    return await this.http.get<{tipoevaluacion: string, index: number, cantItem: number}[]>(this.apiUrlProtocolo + 'consultar/evaluaciones/tipos' ).toPromise();
			
  }

  async posiblesRespEndocrinasAll() : Promise<IPosibles_resp_endocrinas[]> { 

    return await this.http.get<IPosibles_resp_endocrinas[]>(this.apiUrlProtocolo + 'consultar/respuestas/all' ).toPromise();
			
  }

  async EvalPosiblesRespEndocrinasAll() : Promise<IEvaluaciones_PosibleResp[]> { 

    return await this.http.get<IEvaluaciones_PosibleResp[]>(this.apiUrlProtocolo + 'consultar/evaluaciones/respuestas' ).toPromise();
			
  }

  async respuestasPacientesEvalEndocrino(fkPaciente: string, fkProtocolo: string) : Promise<IRespuestas_pacientes_eval_endocrino[]> { 

    return await this.http.get<IRespuestas_pacientes_eval_endocrino[]>(this.apiUrlProtocolo + `consultar/respuestas/${fkPaciente}/${fkProtocolo}`).toPromise();
  }
  
  async consultaFilter(filtro: filtroProtoEndocrino) : Promise<IvProtocoloEndrocrinos[]> { 
    let parametrosUrl = `${filtro.ciPaciente}/${filtro.idProtocolo}/${filtro.fechaIni}/${filtro.fechaFin}/${filtro.medico}/${filtro.uidPaciente}/${filtro.condlogica}`;
    return this.http.get<IvProtocoloEndrocrinos[]>(this.apiUrlProtocolo + 'filtrar/' + parametrosUrl ).toPromise();
			/*.pipe(
			//	tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);*/
  }

  async ultimaEvaluacion(idPaciente: string) : Promise<{ultimoprotocolo: number}> { 
    let parametrosUrl = `${this.apiUrlProtocolo}ultima-evaluacion/${idPaciente}`;
    return await this.http.get<{ultimoprotocolo: number}>(parametrosUrl).toPromise();
  }

  createRecordProtocoloEndocrino(reg: IProtocolosEndrocrinos) {
    return this.http.post<IProtocolosEndrocrinos>(this.apiUrlProtocolo + 'insertar', reg).pipe(
        tap(result => { this.protocolo = result; console.log(`Protocolo insertado`) }),
        catchError(this.handleError)
    );
  }

  createRecordRespProtEndocrino(reg: IRespuestas_pacientes_eval_endocrino) {
    return this.http.post<IRespuestas_pacientes_eval_endocrino>(this.apiUrlProtocolo + 'insertar/respuesta', reg).pipe(
        tap(result => { this.protocolo = result; console.log(`Protocolo insertado`) }),
        catchError(this.handleError)
    );
  }

  updateRecordRespProtEndocrino(reg: IRespuestas_pacientes_eval_endocrino) {
    const url = `${this.apiUrlProtocolo}update/respuesta/${reg.fkprotocolo}`;

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