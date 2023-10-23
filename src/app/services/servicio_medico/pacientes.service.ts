import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IPaciente, IvPaciente, IPacienteConSupervisores } from '../../models/servicio-medico/paciente.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {
  paciente: IvPaciente={};
  
  private apiUrlPacientes : string = environment.apiUrlServMedico + 'pacientes/';

  constructor(private http: HttpClient) { }

  pacientesAll() : Observable<IPaciente[]> { 

    return this.http.get<IvPaciente[]>(this.apiUrlPacientes + 'consultar')
			.pipe(
			//	tap(result => console.log(`pacientesAll`)),
				catchError(this.handleError)
			);
  }

  pacienteOne(cedula: string) : Observable<IvPaciente> { 

    return this.http.get<IvPaciente>(this.apiUrlPacientes + 'consultar/cedula/' + cedula)
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }
  
  pacienteUid(idPaciente: number) : Observable<IvPaciente> { 

    return this.http.get<IvPaciente>(this.apiUrlPacientes + 'consultar/uid/' + idPaciente)
			.pipe(
				tap(),
				catchError(this.handleError)
			);
  }

  async searchPacientesPromise(ciPaciente: string, nombre: string, supervisor: string, cargo: string, dpto: string,condlogica: string) :  Promise<IPacienteConSupervisores[]> { 
    let parametrosUrl = `${ciPaciente}/${nombre}/${supervisor}/${cargo}/${dpto}/${condlogica}`; 
    return await this.http.get<IPacienteConSupervisores[]>(this.apiUrlPacientes + 'filtrar/' + parametrosUrl ).toPromise();
  }

  registrar(reg: IPaciente) {
    return this.http.post<IPaciente>(this.apiUrlPacientes + 'insert', reg).pipe(
        tap(result => { this.paciente = result; console.log(`paciente insertado`) }),
        catchError(this.handleError)
    );
  }

  actualizar(reg: IPaciente) {
    const url = `${this.apiUrlPacientes}update/${reg.uid_paciente}`;

    return this.http.put(url, reg).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlPacientes}delete/${id}`;

    return this.http.delete(url).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  async cuerpoCorreoNuevoIngreso(paciente:IvPaciente, usuario: string){    
    let cuerpo: string="";
    
    let enc: string="";      
    let discapacidad: string="";
    let alegia: string="";
    
    if (paciente.sexo=='M')
      enc=`El Sr. <strong>${paciente.nombre_completo}</strong>`;
    else
      enc=`La Sra. <strong>${paciente.nombre_completo}</strong>`;
    
    cuerpo=`Se le notifica que ${enc}, con Cedula de Identidad <strong>${paciente.ci}</strong>, fue registrado como nuevo paciente para el EXAMEN PRE-EMPLEO. El cual fue registrado por el usuario <strong>${usuario}</strong>.<br>`;	
    
    if (paciente.desc_discapacidad && paciente.desc_discapacidad!==""){
      discapacidad=`Discapacidad: <font color="red"><strong>${paciente.desc_discapacidad}</strong></font>. `;
    }
    
    if (paciente.alergia && paciente.alergia!==""){
      alegia=`Alegia(s): <font color="red"><strong>${paciente.alergia}</strong></font>. `;
    }
    console.log(paciente.edad);
    cuerpo += `${enc} estar&aacute; desempeñando el cargo de ${paciente.cargo} en ${paciente.departamento}, a partir de la fecha ${paciente.fecha_ingreso}. Su edad es de ${paciente.edad.years} años. ${discapacidad} ${alegia}<br>`;    
    
    cuerpo += '<br>';
    cuerpo += 'Para m&aacute;s informaci&oacute;n por favor debe comunicarse con el &aacute;rea de Talento Humano a la Ext. Nro. 229.<p>&nbsp;</p>';
    
    return cuerpo;
  }

  handleError(error: HttpErrorResponse) {
    return throwError(error.message || ' server Error');
  }
}