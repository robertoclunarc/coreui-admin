import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IPatologia } from '../../models/servicio-medico/patologias.model';
import { Iicd } from "../../models/servicio-medico/icd.model";
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatologiasService {
  patologia: IPatologia={};
  icd: Iicd[]=[];
  
  private apiUrlPatologias : string = environment.apiUrlServMedico + 'patologias/';
  private apiUrlIcd : string = environment.apiUrlServMedico + 'icd/';

  constructor(private http: HttpClient) { }

  patologiasAll() : Observable<IPatologia[]> { 

    return this.http.get<IPatologia[]>(this.apiUrlPatologias + 'consultar')
			.pipe(
				//tap(result => console.log(`patologiasAll`)),
				catchError(this.handleError)
			);
  }

  patologiasAntecedentesFamiliares() : Observable<IPatologia[]> { 

    return this.http.get<IPatologia[]>(this.apiUrlPatologias + 'antecedentes')
			.pipe(
			//	tap(result => console.log(`patologiasAntecedentesFamiliares`)),
				catchError(this.handleError)
			);
  }

  patologiaOne(id: number) : Observable<IPatologia> { 

    return this.http.get<IPatologia>(this.apiUrlPatologias + 'consultar/' + id)
			.pipe(
			//	tap(result => console.log(`patologiaOne`)),
				catchError(this.handleError)
			);
  }
  
  consultaFilter(uid: number, descripcion: string, codigo: string, estatus: boolean, tipo: string, view: number) : Observable<IPatologia[]> {
    let parametrosUrl = `${uid}/${descripcion}/${codigo}/${estatus}/${tipo}/${view}`;
    return this.http.get<IPatologia[]>(this.apiUrlPatologias + 'filtrar/' + parametrosUrl)
			.pipe(
			//	tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  filterICD(reg: {query: string}) {
    return this.http.post<Iicd[]>(this.apiUrlIcd + 'filter', reg).pipe(
        tap(result => { this.icd = result; }),
        catchError(this.handleError)
    );
  }

  registrar(reg: IPatologia) {
    return this.http.post<IPatologia>(this.apiUrlPatologias + 'insert', reg).pipe(
        tap(result => { this.patologia = result; console.log(`patologia insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IPatologia) {
    const url = `${this.apiUrlPatologias}update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlPatologias}delete/${id}`;

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