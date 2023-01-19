import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { IRiesgos } from '../../models/servicio-medico/riesgos.model';
import { IRiesgosHistoria, IRiesgosHistorias } from '../../models/servicio-medico/historiamedica.model';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AntecedentesOcupacionalesService {  
  
  private apiUrlAntecedentesOcupacionales : string = environment.apiUrlServMedico + 'antecedentesocupacionales/';

  constructor(private http: HttpClient) { }

  riesgosPaciente(idPaciente: string) : Observable<IRiesgosHistorias[]> { 

    return this.http.get<IRiesgosHistorias[]>(this.apiUrlAntecedentesOcupacionales + 'consultar/pacientes/'+ idPaciente)
			.pipe(
			//	tap(result => console.log(`riesgosPaciente`)),
				catchError(this.handleError)
			);
  } 
  
  riesgosAgente(agente: string) : Observable<IRiesgos[]> { 

    return this.http.get<IRiesgos[]>(this.apiUrlAntecedentesOcupacionales + 'consultar/riesgos/'+ agente)
			.pipe(
			//	tap(result => console.log(`riesgosAgente`)),
				catchError(this.handleError)
			);
  }

  AgentesAll() : Observable<[{agente: string}]> { 

    return this.http.get<[{agente: string}]>(this.apiUrlAntecedentesOcupacionales + 'consultar/agentes')
			.pipe(
			//	tap(result => console.log(`AgentesAll`)),
				catchError(this.handleError)
			);
  } 
  
  registrarAntecedenteOcupacional(reg: IRiesgosHistoria) {
    return this.http.post<IRiesgosHistoria>(this.apiUrlAntecedentesOcupacionales + 'insert', reg).pipe(
        tap(result => { console.log(`Antecedente insertado`) }),
        catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}