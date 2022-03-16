import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IRemitido } from '../../models/remitidos.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RemitidosService {
    remitido: IRemitido={};
  
  private apiUrlRemitidos : string = environment.apiUrlServMedico + 'remitidos/';

  constructor(private http: HttpClient) { }

  remitidosAll() : Observable<IRemitido[]> { 

    return this.http.get<IRemitido[]>(this.apiUrlRemitidos + 'consultar')
			.pipe(
				tap(result => console.log(`remitidosAll`)),
				catchError(this.handleError)
			);
  }

  remitidoOne(id: number) : Observable<IRemitido> { 

    return this.http.get<IRemitido>(this.apiUrlRemitidos + 'consultar/' + id)
			.pipe(
				tap(result => console.log(`remitidoOne`)),
				catchError(this.handleError)
			);
  }
  
  remitidofilter(descripcion: string) : Observable<IRemitido> { 

    return this.http.get<IRemitido>(this.apiUrlRemitidos + 'filtrar/' + descripcion)
			.pipe(
				tap(result => console.log(`remitidofilter`)),
				catchError(this.handleError)
			);
  } 

  registrar(reg: IRemitido) {
    return this.http.post<IRemitido>(this.apiUrlRemitidos + 'insertar', reg).pipe(
        tap(result => { this.remitido = result; console.log(`Remitido insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IRemitido) {
    const url = `${this.apiUrlRemitidos}update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlRemitidos}delete/${id}`;

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