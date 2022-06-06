import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { ITiempoReposo } from '../../models/servicio-medico/tiemporeposos.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TiempoReposoService {
    tiempoReposo: ITiempoReposo={};
  
  private apiUrltiempoReposo : string = environment.apiUrlServMedico + 'tiemporeposo/';

  constructor(private http: HttpClient) { }

  tiempoReposoAll() : Observable<ITiempoReposo[]> { 

    return this.http.get<ITiempoReposo[]>(this.apiUrltiempoReposo + 'consultar')
			.pipe(
				tap(result => console.log(`tiempoReposoAll`)),
				catchError(this.handleError)
			);
  }

  tiempoReposoOne(id: number) : Observable<ITiempoReposo> { 

    return this.http.get<ITiempoReposo>(this.apiUrltiempoReposo + 'consultar/' + id)
			.pipe(
				tap(result => console.log(`tiempoReposoOne`)),
				catchError(this.handleError)
			);
  }
  
  remitidofilter(descripcion: string) : Observable<ITiempoReposo> { 

    return this.http.get<ITiempoReposo>(this.apiUrltiempoReposo + 'filtrar/' + descripcion)
			.pipe(
				tap(result => console.log(`remitidofilter`)),
				catchError(this.handleError)
			);
  } 

  registrar(reg: ITiempoReposo) {
    return this.http.post<ITiempoReposo>(this.apiUrltiempoReposo + 'insertar', reg).pipe(
        tap(result => { this.tiempoReposo = result; console.log(`Tiempo Reposo insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: ITiempoReposo) {
    const url = `${this.apiUrltiempoReposo}update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrltiempoReposo}delete/${id}`;

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