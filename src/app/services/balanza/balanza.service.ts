import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Imaterial } from '../../models/balanza/material.models';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Ibalanza } from '../../models/balanza/balanza.models';
import { IvConsulta, IFiltroConsulta } from '../../models/balanza/consultas.model';

@Injectable({
  providedIn: 'root'
})
export class BalanzasService {
  balanza: Ibalanza={};
  
  private apiUrlBalanzas : string = environment.apiUrlBalanza + 'Balanza/';

  constructor(private http: HttpClient) { }

  BalanzasAll() : Observable<Ibalanza[]> { 

    return this.http.get<Ibalanza[]>(this.apiUrlBalanzas)
			.pipe(
				tap(result => console.log(`BalanzasAll`)),
				catchError(this.handleError)
			);
  }

  consultaFilter(operacion: IFiltroConsulta) : Observable<IvConsulta[]> { 
    let parametrosUrl = operacion.idBoleto + '/' + operacion.tipoOperacion + '/' + operacion.codigoMaterial ;
    return this.http.get<IvConsulta[]>(this.apiUrlBalanzas + 'filtrar/' + parametrosUrl )
			.pipe(
				tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}
