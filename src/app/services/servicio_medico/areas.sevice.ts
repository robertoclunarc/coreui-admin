import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IAreas } from '../../models/servicio-medico/areas.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AreasService {
  area: IAreas={};
  
  private apiUrlareas : string = environment.apiUrlServMedico + 'areas/';

  constructor(private http: HttpClient) { }

  areasAll() : Observable<IAreas[]> { 

    return this.http.get<IAreas[]>(this.apiUrlareas + 'consultar')
			.pipe(
				tap(result => console.log(`areasAll`)),
				catchError(this.handleError)
			);
  }

  areaOne(id: number) : Observable<IAreas> { 

    return this.http.get<IAreas>(this.apiUrlareas + 'consultar/' + id)
			.pipe(
				tap(result => console.log(`areaOne`)),
				catchError(this.handleError)
			);
  }  

  registrar(reg: IAreas) {
    return this.http.post<IAreas>(this.apiUrlareas + 'insertar', reg).pipe(
        tap(result => { this.area = result; console.log(`area insertada`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IAreas) {
    const url = `${this.apiUrlareas}update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlareas}delete/${id}`;

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