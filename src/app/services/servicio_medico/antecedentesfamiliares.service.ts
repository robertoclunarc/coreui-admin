import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IAntecedenteFamiliar, IAntecedentesFamiliares } from '../../models/servicio-medico/antecedentesfamiliares.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AntecedentesFamiliaresService {  
  
  private apiUrlAntecedentesFamiliares : string = environment.apiUrlServMedico + 'antecedentesfamiliares/';

  constructor(private http: HttpClient) { }

  AntecedentesFamiliaresOnePaciente(idPaciente: string) : Observable<IAntecedentesFamiliares[]> { 

    return this.http.get<IAntecedentesFamiliares[]>(this.apiUrlAntecedentesFamiliares + 'consultar/'+ idPaciente)
			.pipe(
				//tap(result => console.log(`AntecedentesFamiliaresOnePaciente`)),
				catchError(this.handleError)
			);
  }  
  
  registrarAntecedenteFamiliar(reg: IAntecedenteFamiliar) {
    return this.http.post<IAntecedenteFamiliar>(this.apiUrlAntecedentesFamiliares + 'insert', reg).pipe(
        tap(result => { console.log(`Antecedente insertado`) }),
        catchError(this.handleError)
    );
  }  

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}