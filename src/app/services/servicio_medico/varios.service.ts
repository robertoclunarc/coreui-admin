import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { INivelAcademico, IContratista } from '../../models/servicio-medico/varios.model';
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

  nivelesAcademicos(): Observable<INivelAcademico[]> {
    return this.http.get<INivelAcademico[]>(this.apiUrlvarios + `nivelesacademicos`)
			.pipe(
				tap(result => console.log(`nivelesAcademicos (${result.length})`)),
				catchError(this.handleError)
			);
  }

  contratistaAll(): Observable<IContratista[]> {
    return this.http.get<IContratista[]>(this.apiUrlvarios + `contratista/consultar`)
			.pipe(
				tap(result => console.log(`contratistaAll (${result.length})`)),
				catchError(this.handleError)
			);
  }

  registrarContratista(reg: IContratista) {
    return this.http.post<IContratista>(this.apiUrlvarios + 'contratista/insert', reg).pipe(
        tap(result => { console.log(`contratista insertado`) }),
        catchError(this.handleError)
    );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}