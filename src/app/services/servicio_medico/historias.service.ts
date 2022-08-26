import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IHistoria_paciente, IHistoria_medica } from '../../models/servicio-medico/historias.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoriaService {
  historia: IHistoria_medica={};
  
  private apiUrlHistoria : string = environment.apiUrlServMedico + 'historias/';

  constructor(private http: HttpClient) { }

  HistoriaPacientesAll() : Observable<IHistoria_paciente[]> { 

    return this.http.get<IHistoria_paciente[]>(this.apiUrlHistoria + 'consultar/atenciones')
			.pipe(
				tap(result => console.log(`HistoriaPacientesAll`)),
				catchError(this.handleError)
			);
  }

  HistoriaMedicaAll() : Observable<IHistoria_medica[]> { 

    return this.http.get<IHistoria_medica[]>(this.apiUrlHistoria + 'accidentes/ocupacionales')
			.pipe(
				tap(result => console.log(`HistoriaMedicaAll`)),
				catchError(this.handleError)
			);
  }

  async historia_paciente(fk_historia: string, fk_consulta: string) :  Promise<IHistoria_paciente[]> { 
     
    return await this.http.get<IHistoria_paciente[]>(`${this.apiUrlHistoria}atenciones/${fk_historia}/${fk_consulta}` ).toPromise();
  }

  historiaMedicaOne(uid_historia: string, uid_paciente: string) : Observable<IHistoria_medica> { 
     
    return  this.http.get<IHistoria_medica>(`${this.apiUrlHistoria}accidente/ocupacional/${uid_historia}/${uid_paciente}` )
    .pipe(
        tap(result => console.log(`historiaMedicaOne(${result.uid_historia}, ${result.uid_paciente}`)),
        catchError(this.handleError)
    );
  }

  async nuevoHistoriaPaciente(hist: IHistoria_paciente): Promise<IHistoria_paciente> {
    return await this.http.post<IHistoria_paciente>(this.apiUrlHistoria + 'insert/atencion', hist).toPromise();    
    
  }

  async nuevoHistoriaHistoriaMedica(hist: IHistoria_medica): Promise<IHistoria_medica> {
    return await this.http.post<IHistoria_medica>(this.apiUrlHistoria + 'insert/accidentes/ocupacionales', hist).toPromise();    
    
  }

  updateHistoriaPaciente(hist: IHistoria_paciente) {
    const url = `${this.apiUrlHistoria}update/atencion/${hist.fk_consulta}/${hist.fk_historia}`;

    return this.http.put(url, hist).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }
  
  updateHistoriaMedica(hist: IHistoria_medica) {
    const url = `${this.apiUrlHistoria}update/accidentes/ocupacionales/${hist.uid_historia}`;

    return this.http.put(url, hist).pipe(
        tap(result => { console.log(result)
        }),
        catchError(this.handleError)
    );
  } 

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}