import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ICargoAnterior, ICargoAnteriorOtra } from '../../models/servicio-medico/cargos_anteriores.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargosAnterioresService {  
  
  private apiUrlCargosanteriores : string = environment.apiUrlServMedico + 'cargosanteriores/';

  constructor(private http: HttpClient) { }

  cargosAnterioresAll(idPaciente: string) : Observable<ICargoAnterior[]> { 

    return this.http.get<ICargoAnterior[]>(this.apiUrlCargosanteriores + 'consultar/'+ idPaciente)
			.pipe(
				tap(result => console.log(`cargosAnterioresAll`)),
				catchError(this.handleError)
			);
  }

  cargosAnterioresOtrasAll(idPaciente: string) : Observable<ICargoAnteriorOtra[]> { 

    return this.http.get<ICargoAnteriorOtra[]>(this.apiUrlCargosanteriores + 'consultar/otras/'+ idPaciente)
			.pipe(
				tap(result => console.log(`cargosAnterioresOtrasAll`)),
				catchError(this.handleError)
			);
  }  
  
  registrarCargoAnterior(reg: ICargoAnterior) {
    return this.http.post<ICargoAnterior>(this.apiUrlCargosanteriores + 'insert', reg).pipe(
        tap(result => { console.log(`cargo insertado`) }),
        catchError(this.handleError)
    );
  }

  registrarCargoAnteriorOtra(reg: ICargoAnteriorOtra) {
    return this.http.post<ICargoAnteriorOtra>(this.apiUrlCargosanteriores + 'insert/otras', reg).pipe(
        tap(result => { console.log(`cargo insertado`) }),
        catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}