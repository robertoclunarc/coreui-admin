import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IsignosVitales } from '../../models/servicio-medico/signos_vitales.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignosVitalesService {
    signosVitales: IsignosVitales={};
  
  private apiUrlSignosVitales : string = environment.apiUrlServMedico + 'signosvitales/';

  constructor(private http: HttpClient) { }

  signosVitalesAll() : Observable<IsignosVitales[]> { 

    return this.http.get<IsignosVitales[]>(this.apiUrlSignosVitales + 'consultar')
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }

  signosVitalesOne(cedula: string, fecha: string) : Observable<IsignosVitales> { 

    return this.http.get<IsignosVitales>(this.apiUrlSignosVitales + `consultar/${cedula}/${fecha}`)
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }

  signosVitalesPaciente(cedula: string) : Observable<IsignosVitales[]> { 

    return this.http.get<IsignosVitales[]>(this.apiUrlSignosVitales + `consultar/${cedula}`)
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }

  registrar(reg: IsignosVitales) {
    return this.http.post<IsignosVitales>(this.apiUrlSignosVitales + 'insert', reg).pipe(
        tap(result => { this.signosVitales = result; }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IsignosVitales) {
    const url = `${this.apiUrlSignosVitales}update/${reg.cedula}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(cedula: string) {
    const url = `${this.apiUrlSignosVitales}delete/${cedula}`;

    return this.http.delete(url).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }  

  evaluarPresion(d: number, s: number ) {
    //console.log(`sistólica=${s}, diastólica=${d} ${typeof s} ${typeof d}`);

    if ((s == null || d == null)  || (typeof s == 'number' && s == 0) || (typeof d == 'number' && d == 0)) {
      return { estado: '', color: '', icono: '', aviso: '' };
    }

    // HIPOTENSIÓN
    if (s < 90 && d < 60) {
      return {
        estado: 'HIPOTENSIÓN',
        color: 'presion-baja',
        icono: 'fa-arrow-down',
        aviso: 'Presión arterial baja - AVISAR AL MÉDICO'
      };
    }

    // HTA III
    if (s >= 180 || d >= 110) {
      return {
        estado: 'HTA ESTADIO III',
        color: 'presion-hta3',
        icono: 'fa-exclamation-triangle',
        aviso: 'Presión arterial muy alta - AVISAR AL MÉDICO'
      };
    }

    // HTA II
    if ((s >= 160 && s <= 179) || (d >= 100 && d <= 109)) {
      return {
        estado: 'HTA ESTADIO II',
        color: 'presion-hta2',
        icono: 'fa-exclamation',
        aviso: 'Presión arterial alta - AVISAR AL MÉDICO'
      };
    }

    // HTA I
    if ((s >= 140 && s <= 159) || (d >= 90 && d <= 99)) {
      return {
        estado: 'HTA ESTADIO I',
        color: 'presion-hta1',
        icono: 'fa-warning',
        aviso: 'RECOMENDABLE CONTROLAR MÁS FRECUENTEMENTE',
      };
    }

    // NORMAL ALTA
    if ((s >= 130 && s <= 139) || (d >= 85 && d <= 89)) {
      return {
        estado: 'NORMAL ALTA',
        color: 'presion-normal-alta',
        icono: 'fa-eye',
        aviso: 'Presión arterial en el límite - RECOMENDABLE CONTROLAR MÁS FRECUENTEMENTE'
      };
    }

    // NORMAL
    if (s < 130 && d < 85) {
      return {
        estado: 'NORMAL',
        color: 'presion-normal',
        icono: 'fa-check',
        aviso: ''
      };
    }

    // ÓPTIMA
    if (s < 120 && d < 80) {
      return {
        estado: 'OPTIMA',
        color: 'presion-optima',
        icono: 'fa-heart',
        aviso: ''
      };
    }

    return { estado: '', color: '', icono: '', aviso: '' };
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}