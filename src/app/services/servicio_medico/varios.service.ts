import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { INivelAcademico, IContratista } from '../../models/servicio-medico/varios.model';
import { environment } from '../../../environments/environment';
import { Options } from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class VarioService {  
  
  private apiUrlvarios : string = environment.apiUrlServMedico + 'varios/';
  private urlImagenPacente: string = environment.urlImagenFotoTrabajador;
  private extFoto: string = environment.extensionFotoTrabajador;
  constructor(private http: HttpClient) { }  

  generarSerie(inicio: string, fin: string, interval: string, formato: string) : Observable<{fecha, dia}[]> { 

    return this.http.get<{fecha, dia}[]>(this.apiUrlvarios + `generar/serie/${inicio}/${fin}/${interval}/${formato}`)
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }

  nivelesAcademicos(): Observable<INivelAcademico[]> {
    return this.http.get<INivelAcademico[]>(this.apiUrlvarios + `nivelesacademicos`)
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }

  contratistaAll(): Observable<IContratista[]> {
    return this.http.get<IContratista[]>(this.apiUrlvarios + `contratista/consultar`)
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }

  registrarContratista(reg: IContratista) {
    return this.http.post<IContratista>(this.apiUrlvarios + 'contratista/insert', reg).pipe(
        tap(result => { console.log(`contratista insertado`) }),
        catchError(this.handleError)
    );
  }

  fileExists(url: string): boolean {
    let http = new XMLHttpRequest(); 
    http.open('HEAD', url, false); 
    http.send();    
    if (http.status!=404){
      return true;
    }
    else{
      console.log(`No entontro archivo: ${url} => error.status: ${http.status}`);
      return false;
    }
  }  

  searchHeroes(cedula: string):Observable<Blob>{
    const param: string =  cedula + this.extFoto;
    const params = new HttpParams({fromString: `file=${param}`});
    return this.http.request('GET', this.urlImagenPacente, {responseType:'blob', params});
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}