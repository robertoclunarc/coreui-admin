import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IAfecciones } from '../../models/servicio-medico/afecciones.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AfeccionesService {
  patologia: IAfecciones={};
  
  private apiUrlAfecciones : string = environment.apiUrlServMedico + 'afecciones/';

  constructor(private http: HttpClient) { }

  AfeccionesAll() : Observable<IAfecciones[]> { 

    return this.http.get<IAfecciones[]>(this.apiUrlAfecciones + 'consultar')
			.pipe(
			//	tap(result => console.log(`AfeccionesAll`)),
				catchError(this.handleError)
			);
  }

  afeccionOne(id: number) : Observable<IAfecciones> { 

    return this.http.get<IAfecciones>(this.apiUrlAfecciones + 'consultar/' + id)
			.pipe(
			//	tap(result => console.log(`afeccionOne`)),
				catchError(this.handleError)
			);
  }
  
  consultaFilter(uid: number, descripcion: string, codigo: string) : Observable<IAfecciones[]> { 
    let parametrosUrl = descripcion + '/' + codigo;
    return this.http.get<IAfecciones[]>(this.apiUrlAfecciones + '/filtrar/' + parametrosUrl )
			.pipe(
			//	tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  registrar(reg: IAfecciones) {
    return this.http.post<IAfecciones>(this.apiUrlAfecciones + 'insertar', reg).pipe(
        tap(result => { this.patologia = result; console.log(`patologia insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IAfecciones) {
    const url = `${this.apiUrlAfecciones}update/${reg.idafecciones}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlAfecciones}delete/${id}`;

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