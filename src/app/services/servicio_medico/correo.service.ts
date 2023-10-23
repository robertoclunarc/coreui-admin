import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { ImailOptions } from '../../models/servicio-medico/correo.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorreoService {
  mensaje: {message?: string, info?: string, error?: string} = {};
  
  private apiUrlCorreos : string = environment.apiUrlServMedico + 'correo/';
  
  constructor(private http: HttpClient) {}

  async enviarAchivo(opt: FormData) {
    opt.append('from', environment.fromEmail);
    opt.append('name', environment.nameSistema);
    return await this.http.post<{message, info, error}>(this.apiUrlCorreos + 'send/path', opt).toPromise();
    /*    result => { this.mensaje = result; console.log(result) },
        error => {(this.handleError(error))}
    );*/
  }

  async enviarBuffer(opt: ImailOptions) {
    let optMail: ImailOptions = opt;
    optMail.from = environment.fromEmail;
    optMail.name = environment.nameSistema;
    return await this.http.post<{message, info, error}>(this.apiUrlCorreos + 'send/memory', optMail).toPromise();
    /*    result => { this.mensaje = result; console.log(result) },
        error => {(this.handleError(error))}
    );*/
  }

  remitentes(actividad: string) : Observable<string[]> {
    return this.http.get<string[]>(this.apiUrlCorreos + `remitentes/${actividad}`)
        .pipe(
            //tap(result => console.log(`consultasAfeccionesAll (${result.length})`)),
            catchError(this.handleError)
        );
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}