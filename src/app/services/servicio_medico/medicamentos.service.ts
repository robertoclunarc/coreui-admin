import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IMedicamento, IMedicamentosAplicados, ImedicamentosConsulta } from '../../models/medicamentos.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {
  medicamento: IMedicamento={};
  
  private apiUrlMedicamentos : string = environment.apiUrlServMedico + 'medicamentos/';

  constructor(private http: HttpClient) { }

  medicamentosAll() : Observable<IMedicamento[]> { 

    return this.http.get<IMedicamento[]>(this.apiUrlMedicamentos + 'consultar')
			.pipe(
				tap(result => console.log(`medicamentosAll`)),
				catchError(this.handleError)
			);
  }

  medicamentosAplicados(id: number) : Observable<ImedicamentosConsulta> { 

    return this.http.get<ImedicamentosConsulta>(this.apiUrlMedicamentos + 'consultar/aplicados/' + id)
			.pipe(
				tap(result => console.log(`medicamentosAplicados`)),
				catchError(this.handleError)
			);
  }  
  

  registrarMedicamentosAplicados(reg: IMedicamentosAplicados) {
    return this.http.post<IMedicamentosAplicados>(this.apiUrlMedicamentos + 'insert/aplicados', reg).pipe(
        tap(result => { this.medicamento = result; console.log(`medicamentos aplicados insertado`) }),
        catchError(this.handleError)
    );
  }  

  actualizar(reg: IMedicamento) {
    const url = `${this.apiUrlMedicamentos}update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlMedicamentos}delete/${id}`;

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
