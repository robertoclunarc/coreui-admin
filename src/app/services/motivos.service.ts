import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IMotivo } from '../models/motivos.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MotivosService {
  motivo: IMotivo={};
  
  private apiUrlMotivos : string = environment.apiUrlServMedico + 'motivos/';

  constructor(private http: HttpClient) { }

  motivosAll() : Observable<IMotivo[]> { 

    return this.http.get<IMotivo[]>(this.apiUrlMotivos + 'consultar')
			.pipe(
				tap(result => console.log(`motivosAll`)),
				catchError(this.handleError)
			);
  }

  motivoOne(id: number) : Observable<IMotivo> { 

    return this.http.get<IMotivo>(this.apiUrlMotivos + 'consultar/' + id)
			.pipe(
				tap(result => console.log(`motivoOne`)),
				catchError(this.handleError)
			);
  }  

  registrar(reg: IMotivo) {
    return this.http.post<IMotivo>(this.apiUrlMotivos + 'insertar', reg).pipe(
        tap(result => { this.motivo = result; console.log(`motivo insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IMotivo) {
    const url = `${this.apiUrlMotivos}update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlMotivos}delete/${id}`;

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
