import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IFilterSolicitud, ISolicitudAtencion, ISolicitudesAtenciones, ISolicitudesConsultas } from '../../models/servicio-medico/solicitudatencion.model';
import { catchError, tap} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { IPacienteConSupervisores } from '../../models/servicio-medico/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudAtencionService {
  solicitud: ISolicitudAtencion={};
  
  private apiUrlSolicitud : string = environment.apiUrlServMedico + 'solicitudes/';

  constructor(private http: HttpClient) { }

  solicitudesAll() : Observable<ISolicitudAtencion[]> {
    return this.http.get<ISolicitudAtencion[]>(this.apiUrlSolicitud + 'consultar')
        .pipe(
        //	tap(result => console.log(`SolicitudAll`)),
            catchError(this.handleError)
        );
  }

  solicitudOne(id: number) : Observable<ISolicitudAtencion> {
    return this.http.get<ISolicitudAtencion>(this.apiUrlSolicitud + 'consultar/' + id)
      .pipe(
      //	tap(result => console.log(`SolicitudOne`)),
          catchError(this.handleError)
      );
  }

  atencionOne(id: number) : Observable<ISolicitudesConsultas> {
    return this.http.get<ISolicitudesConsultas>(this.apiUrlSolicitud + 'consultar/atencion/' + id)
      .pipe(
      //	tap(result => console.log(`SolicitudOne`)),
          catchError(this.handleError)
      );
  }

  async searchSolicitudesPromise(filtro: IFilterSolicitud) :  Promise<ISolicitudesAtenciones[]> { 
    let parametrosUrl = `${filtro.uid}/${filtro.ciPaciente}/${filtro.nombre}/${filtro.supervisor}/${filtro.fecha_solicitud}/${filtro.medico}/${filtro.paramedico}/${filtro.estatus}/${filtro.condlogica}`; 
    return await this.http.get<ISolicitudesAtenciones[]>(this.apiUrlSolicitud + 'filtrar/' + parametrosUrl ).toPromise();
  }

  registrar(reg: ISolicitudAtencion) {
    return this.http.post<ISolicitudAtencion>(this.apiUrlSolicitud + 'insert', reg).pipe(
        tap(result => { this.solicitud = result; console.log(`solicitud insertada`) }),
        catchError(this.handleError)
    );
  }

  registrarConsultaSolicitud(reg: ISolicitudesConsultas) {
    return this.http.post<ISolicitudesConsultas>(this.apiUrlSolicitud + 'insert/solictud/consulta', reg).pipe(
        tap(result => { this.solicitud = result; console.log(`solicitud insertada`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: ISolicitudAtencion) {
    const url = `${this.apiUrlSolicitud}update/${reg.uid}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlSolicitud}delete/${id}`;

    return this.http.delete(url).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  async cuerpoCorreoNuevaSolicitud(paciente: IPacienteConSupervisores, fecha: string, solicitud: ISolicitudAtencion){    
    let cuerpo: string="";
    
    let enc: string="";      
    let discapacidad: string="";
    let alegia: string="";
    
    if (paciente.sexo=='M')
      enc=`El Sr. <strong>${paciente.nombre_completo}</strong>`;
    else
      enc=`La Sra. <strong>${paciente.nombre_completo}</strong>`;
    
    cuerpo=`Se le notifica que ${enc}, con Cedula de Identidad <strong>${paciente.ci}</strong>, a realizado una Solicitud de Asistencia <strong>,ID: ${solicitud.uid}</strong>, en la fecha <strong>${fecha}</strong>.<br> Por motivo: ${solicitud.motivo}.<br>`;	
    
    if (paciente.desc_discapacidad && paciente.desc_discapacidad!==""){
      discapacidad=`Discapacidad: <font color="red"><strong>${paciente.desc_discapacidad}</strong></font>. `;
    }
    
    if (paciente.alergia && paciente.alergia!==""){
      alegia=`Alegia(s): <font color="red"><strong>${paciente.alergia}</strong></font>. `;
    }
    
    cuerpo += `Su edad es de ${paciente.edad} años. ${discapacidad} ${alegia}<br>`;    
    
    cuerpo += '<br>';
    cuerpo += `Para m&aacute;s informaci&oacute;n por favor debe comunicarse con el(la) supervisor(a) ${paciente.nombres_jefe}.<p>&nbsp;</p>`;
    
    return cuerpo;
  }

  async cuerpoCorreoSolicitudAtendida(paciente: IPacienteConSupervisores, solicitud: ISolicitudAtencion, proxCita?: string, reposo?: string){    
    let cuerpo: string="";
    
    let enc: string="";
    if (paciente.sexo=='M')
      enc=`El Sr. <strong>${paciente.nombre_completo}</strong>`;
    else
      enc=`La Sra. <strong>${paciente.nombre_completo}</strong>`;
    
    cuerpo=`Se le notifica que ${enc}, con Cedula de Identidad <strong>${paciente.ci}</strong>, a sido atendido en Servicio Médico de nuestra empresa<strong>. Solicitud ID: ${solicitud.uid}</strong>, en la fecha <strong>${solicitud.fecha_atencion}</strong>, hora de salida: ${solicitud.fecha_salida}.<br>`;

    if (proxCita){
      cuerpo+=`${enc} queda pendiente para una próxima cita médica el ${proxCita}<br>`;
    }else{
      cuerpo+=`La atención Médica queda es estatus Cerrada. Si ${enc} requiere otra atención deberá reportale a su supervisor para hacer una nueva solicitud de asistencia.<br>`;
    }
    
    if(solicitud.id_reposo){
      cuerpo+=`El Dr. le ha recomendado guardar reposo por ${reposo}.`;
    }
    
    cuerpo += '<br>';
    cuerpo += `Para m&aacute;s informaci&oacute;n por favor debe comunicarse con el área de Servicio Médico a la ext. 259.<p>&nbsp;</p>`;
    
    return cuerpo;
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}