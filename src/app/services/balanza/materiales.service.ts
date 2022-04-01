import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Imaterial } from '../../models/balanza/material.models';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {
  patologia: Imaterial={};
  
  private apiUrlMateriales : string = environment.apiUrlBalanza + 'Materiales/';

  constructor(private http: HttpClient) { }

  MaterialesAll() : Observable<Imaterial[]> { 

    return this.http.get<Imaterial[]>(this.apiUrlMateriales + 'consultar')
			.pipe(
				tap(result => console.log(`MaterialesAll`)),
				catchError(this.handleError)
			);
  }

  afeccionOne(id: number) : Observable<Imaterial> { 

    return this.http.get<Imaterial>(this.apiUrlMateriales + 'consultar/' + id)
			.pipe(
				tap(result => console.log(`afeccionOne`)),
				catchError(this.handleError)
			);
  }
  
  consultaFilter(uid: number, descripcion: string, codigo: string) : Observable<Imaterial[]> { 
    let parametrosUrl = descripcion + '/' + codigo;
    return this.http.get<Imaterial[]>(this.apiUrlMateriales + '/filtrar/' + parametrosUrl )
			.pipe(
				tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  registrar(reg: Imaterial) {
    return this.http.post<Imaterial>(this.apiUrlMateriales + 'insertar', reg).pipe(
        tap(result => { this.patologia = result; console.log(`patologia insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: Imaterial) {
    const url = `${this.apiUrlMateriales}update/${reg.idMaterial}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlMateriales}delete/${id}`;

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
