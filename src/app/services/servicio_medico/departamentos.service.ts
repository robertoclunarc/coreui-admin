import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IGerencia, Idepartamentos, IAreas, IvDepartamentos } from '../../models/servicio-medico/departamentos.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentosService {  
  
  private apiUrlDepartamentos : string = environment.apiUrlServMedico + 'departamentos/';

  constructor(private http: HttpClient) { }

  departamentosAll() : Observable<Idepartamentos[]> { 

    return this.http.get<Idepartamentos[]>(this.apiUrlDepartamentos + 'consultar/areas')
			.pipe(
				tap(result => console.log(`departamentosAll`)),
				catchError(this.handleError)
			);
  }

  areasAll() : Observable<IAreas[]> { 

    return this.http.get<IAreas[]>(this.apiUrlDepartamentos + 'consultar/areas')
			.pipe(
				tap(result => console.log(`areasAll`)),
				catchError(this.handleError)
			);
  }

  gerenciasAll() : Observable<IGerencia[]> { 

    return this.http.get<IGerencia[]>(this.apiUrlDepartamentos + 'consultar/gerencias')
			.pipe(
				tap(result => console.log(`gerenciasAll`)),
				catchError(this.handleError)
			);
  }
  
  departamentosFilter(uidDep: string, uidGcia: string, area: string, ccosto: string) : Observable<IvDepartamentos[]> { 
    let parametrosUrl = uidGcia + '/' + uidDep + '/' + area + '/' + ccosto;
    return this.http.get<IvDepartamentos[]>(this.apiUrlDepartamentos + '/filtrar/' + parametrosUrl )
			.pipe(
				tap(result => console.log(`departamentosFilter`)),
				catchError(this.handleError)
			);
  }

  

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}