import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VarioService {  
  
  private apiUrlvarios : string = environment.apiUrlServMedico + 'varios/';

  constructor(private http: HttpClient) { }  

  generarSerie(inicio: string, fin: string, interval: string, formato: string) : Observable<{fecha, dia}[]> { 

    return this.http.get<{fecha, dia}[]>(this.apiUrlvarios + `generar/serie/${inicio}/${fin}/${interval}/${formato}`)
			.pipe(
				tap(result => console.log(`generarSerie (${result.length})`)),
				catchError(this.handleError)
			);
  }  

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}