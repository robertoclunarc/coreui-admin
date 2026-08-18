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

  /*evaluarPresion(d: number, s: number ) {
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
  }*/

  evaluarPresion(s: number, d: number): {
    estado: string;
    color: string;
    icono: string;
    aviso: string;
  } {

    // Validación de los valores recibidos
    if (
      s === null ||
      s === undefined ||
      d === null ||
      d === undefined ||
      isNaN(Number(s)) ||
      isNaN(Number(d)) ||
      Number(s) <= 0 ||
      Number(d) <= 0
    ) {
      return {
        estado: 'SIN DATOS',
        color: '',
        icono: 'fa fa-question-circle',
        aviso: 'No se han proporcionado valores válidos de presión arterial.'
      };
    }

    s = Number(s);
    d = Number(d);

    // =========================================================
    // HIPOTENSIÓN
    // TAS < 90 y TAD < 60
    // =========================================================
    if (s < 90 && d < 60) {
      return {
        estado: 'HIPOTENSIÓN',
        color: 'presion-baja',
        icono: 'fa fa-arrow-down',
        aviso: 'Presión arterial baja. Se recomienda verificar nuevamente la presión.'
      };
    }

    // =========================================================
    // HTA ESTADIO III
    // TAS >= 180 o TAD >= 110
    // =========================================================
    if (s >= 180 || d >= 110) {      
      return {
        estado: 'HTA ESTADIO III',
        color: 'presion-hta3',
        icono: 'fa fa-exclamation-triangle',
        aviso: 'Presión arterial muy elevada. Se recomienda valoración médica.'
      };
    }

    // =========================================================
    // HTA ESTADIO II
    // TAS 160-179 o TAD 100-109
    // =========================================================
    if (s >= 160 || d >= 100) {
      return {
        estado: 'HTA ESTADIO II',
        color: 'presion-hta2',
        icono: 'fa fa-exclamation-circle',
        aviso: 'Presión arterial elevada. Se recomienda control y seguimiento.'
      };
    }

    // =========================================================
    // HTA ESTADIO I
    // TAS 140-159 o TAD 90-99
    // =========================================================
    if (s >= 140 || d >= 90) {      
      return {
        estado: 'HTA ESTADIO I',
        color: 'presion-hta1',
        icono: 'fa fa-exclamation-circle',
        aviso: 'Presión arterial elevada. Se recomienda realizar seguimiento.'
      };
    }

    // =========================================================
    // NORMAL ALTA
    // TAS 130-139 o TAD 85-89
    // =========================================================
    if (s >= 130 || d >= 85) {
      return {
        estado: 'NORMAL ALTA',
        color: 'presion-normal-alta',
        icono: 'fa fa-arrow-up',
        aviso: 'Presión arterial normal alta. Se recomienda controlar periódicamente.'
      };
    }

    // =========================================================
    // ÓPTIMA
    // TAS < 120 y TAD < 80
    // =========================================================
    if (s < 120 && d < 80) {
      return {
        estado: 'ÓPTIMA',
        color: 'presion-optima',
        icono: 'fa fa-check-circle',
        aviso: 'Presión arterial óptima.'
      };
    }

    // =========================================================
    // NORMAL
    // TAS 120-129 y TAD 80-84
    // =========================================================
    return {
      estado: 'NORMAL',
      color: 'presion-normal',
      icono: 'fa fa-check-circle',
      aviso: 'Presión arterial normal.'
    };
  }

    handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}