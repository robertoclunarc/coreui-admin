import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { IConsultas, IFiltroConsulta, INotaExamen, IvConsulta, IvMorbilidad } from '../../models/servicio-medico/consultas.model';
import { catchError, tap, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  consulta: IConsultas={};
  
  private apiUrlConsultas : string = environment.apiUrlServMedico + 'consultas/';

  constructor(private http: HttpClient) { }

  consultasAll() : Observable<IConsultas[]> { 

    return this.http.get<IConsultas[]>(this.apiUrlConsultas + 'consultar')
			.pipe(
				//tap(result => console.log(`consultasAll`)),
				catchError(this.handleError)
			);
  }

  consultasOne(id: number) : Observable<IConsultas> { 

    return this.http.get<IConsultas>(this.apiUrlConsultas + 'consultar/' + id)
			.pipe(
				//tap(result => console.log(`consultasOne`)),
				catchError(this.handleError)
			);
  }

  consultasCount(login: string) : Observable<number> { 

    return this.http.get<number>(this.apiUrlConsultas + 'consultar/atenciones/' + login);
  }

  consultaFilter(atencion: IFiltroConsulta) : Observable<IvConsulta[]> { 
    let parametrosUrl = `${atencion.ciPaciente}/${atencion.uidConsulta}/${atencion.fechaIni}/${atencion.fechaFin}/${atencion.Medico}/${atencion.Paramedico}/${atencion.Motivo}/${atencion.uidMotivo}/${atencion.nombrePaciente}/${atencion.cargo}/${atencion.fecha}/${atencion.condlogica}/${atencion.patologia}`; 
    return this.http.get<IvConsulta[]>(this.apiUrlConsultas + 'filtrar/' + parametrosUrl )
			.pipe(
				///tap(result => console.log(`consultaFilter`)),
				catchError(this.handleError)
			);
  }

  morbilidadFilter(atencion: IFiltroConsulta) : Observable<IvMorbilidad[]> { 
    let parametrosUrl = `${atencion.ciPaciente}/${atencion.uidConsulta}/${atencion.fechaIni}/${atencion.fechaFin}/${atencion.Medico}/${atencion.Paramedico}/${atencion.Motivo}/${atencion.uidMotivo}/${atencion.nombrePaciente}/${atencion.cargo}/${atencion.fecha}/${atencion.condlogica}/${atencion.patologia}`; 
    return this.http.get<IvMorbilidad[]>(this.apiUrlConsultas + 'morbilidad/' + parametrosUrl )
			.pipe(
				//tap(result => console.log(`morbilidadFilter`)),
				catchError(this.handleError)
			);
  }

  async searchConsultaPromise(atencion: IFiltroConsulta) :  Promise<IvConsulta[]> { 
    let parametrosUrl = `${atencion.ciPaciente}/${atencion.uidConsulta}/${atencion.fechaIni}/${atencion.fechaFin}/${atencion.Medico}/${atencion.Paramedico}/${atencion.Motivo}/${atencion.uidMotivo}/${atencion.nombrePaciente}/${atencion.cargo}/${atencion.fecha}/${atencion.condlogica}/${atencion.patologia}`; 
    return await this.http.get<IvConsulta[]>(this.apiUrlConsultas + 'filtrar/' + parametrosUrl ).toPromise();
  }

  async notaExamen(uidConsulta: number) : Promise<INotaExamen> {

    return await this.http.get<INotaExamen>(this.apiUrlConsultas + `notaexamen/${uidConsulta}`).toPromise();
  }

  consultasPorMotivos() : Observable<{id_motivo, descripcion, totalmotivos }[]> { 

    return this.http.get<{id_motivo, descripcion, totalmotivos }[]>(this.apiUrlConsultas + 'motivos')
			.pipe(
				//tap(result => console.log(`consultasPorMotivos (${result.length})`)),
				catchError(this.handleError)
			);
  }

  countAtencionPorMotivosMedicos(login: string, tipoMedico: string ) : Observable<{id_motivo:number, descripcion: string, totalmotivos:number }[]> { 

    return this.http.get<{id_motivo:number, descripcion: string, totalmotivos:number}[]>(this.apiUrlConsultas + `motivos/medicos/${login}/${tipoMedico}`)
			.pipe(
				//tap(result => console.log(`countAtencionPorMotivosMedicos (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasPorMotivosDelAnio() : Observable<{id_motivo, descripcion, diamesanio, cantmotivos }[]> { 

    return this.http.get<{id_motivo, descripcion, diamesanio, cantmotivos }[]>(this.apiUrlConsultas + 'motivos/delanio')
			.pipe(
				//tap(result => console.log(`consultasPorMotivosDelAnio (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasAfecciones() : Observable<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number }[]> { 

    return this.http.get<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number}[]>(this.apiUrlConsultas + 'afecciones')
			.pipe(
				//tap(result => console.log(`consultasAfecciones (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasAfeccionesMeses() : Observable<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number }[]> { 

    return this.http.get<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number}[]>(this.apiUrlConsultas + 'afecciones/meses')
			.pipe(
				//tap(result => console.log(`consultasAfeccionesMeses (${result.length})`)),
				catchError(this.handleError)
			);
  }

  consultasAfeccionesAnios() : Observable<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number }[]> { 

    return this.http.get<{fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number}[]>(this.apiUrlConsultas + 'afecciones/anios')
			.pipe(
				//tap(result => console.log(`consultasAfeccionesAnios (${result.length})`)),
				catchError(this.handleError)
			);
  }
  
  consultasAfeccionesAll(interval: string) : Observable<{ fkafeccion: number, cantafeccion: number }[]> { 

    return this.http.get<{ fkafeccion: number, cantafeccion: number}[]>(this.apiUrlConsultas + `afecciones/all/${interval}`)
			.pipe(
				//tap(result => console.log(`consultasAfeccionesAll (${result.length})`)),
				catchError(this.handleError)
			);
  }

  countResultadoEvalParamedicos(login: string) : Observable<{ id_paramedico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number }[]> { 

    return this.http.get<{ id_paramedico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number}[]>(this.apiUrlConsultas + `resultadoevaluacion/paramedicos/${login}`)
			.pipe(
				//tap(result => console.log(`consultasAfeccionesAll (${result.length})`)),
				catchError(this.handleError)
			);
  }

  countResultadoEvalMedicos(login: string) : Observable<{ id_medico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number }[]> { 

    return this.http.get<{ id_medico: number, nombre: string, login: string, tipo_medico: string, mesanio: string, result_eva: string, conteval: number}[]>(this.apiUrlConsultas + `resultadoevaluacion/medicos/${login}`)
			.pipe(
				//tap(result => console.log(`consultasAfeccionesAll (${result.length})`)),
				catchError(this.handleError)
			);
  }

  planilla_certificado (sexo: string , condicion: string, idmotivo: number, fecha: string, nombre_completo: string, ci: string, cargo: string, motivo: string, firma_dr: string){
      let sx: string='';
      
      if (sexo=='M')
          sx='Masculino';
      else
          sx='Femenino';

      const dirser: string = 'http://10.50.188.48/servicio_medico/';
      
      const imgvacia: string = `<img width="40px" height="40px" align="center" src="${dirser}images/check_vacio_1.jpg">`;
      const imgv: string = `<img width="40px" height="40px" align="center" src="${dirser}images/check_green_1.jpg">`;
      const imgr: string = `<img width="40px" height="40px" align="center" src="${dirser}images/check_red_1.jpg">`;

      let existeHallazgo: string;
      if (condicion=='APTO') 
        existeHallazgo='NO';
      else 
        existeHallazgo='SI';

      let check1: string =imgvacia;
      if (idmotivo==9)
          if (condicion=='APTO')
              check1=imgv;

      let check2: string =imgvacia;
      if (idmotivo==8)
          if (condicion=='APTO')
              check2=imgv;            

      let check3: string =imgvacia;
      if (condicion=='APTO CON RESTRICCION')
          check3=imgv;

      let check4: string =imgvacia;
      if (idmotivo==7)
          if (condicion=='APTO')
              check4=imgv;

      let check5: string =imgvacia;
      if (idmotivo==9)
          if (condicion=='NO APTO')
              check5=imgr;

      let check6: string =imgvacia;
      if (idmotivo==13)
          if (condicion=='APTO')
              check6=imgv;    

      let check7: string =imgvacia;
      if (idmotivo==10)
          if (condicion=='APTO')
              check7=imgv;

      let html: string = '';    
      
      html+=`<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/></head><body><p>&nbsp;</p><TABLE width="100%" border="0" cellspacing="0" cellpadding="0"><TR><TD style="vertical-align:middle; text-align:center" WIDTH="10%"><img align="center" width="110px" height="70px" src="${dirser}images/MATESI_logo_1.png"></TD><TD WIDTH="70%"></TD><TD style="vertical-align:middle; text-align:center" WIDTH="10%"><img align="center" width="110px" height="70px" src="${dirser}images/logo_1.png"></TD><TD style="vertical-align:middle; text-align:center" WIDTH="10%"><img align="center" src="${dirser}images/logo_serv_med_1.jpg"></TD></TR></TABLE>
      <TABLE width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td width="33%">&nbsp;</td>
          <td width="34%">&nbsp;</td>
          <td width="33%" style="vertical-align:middle; text-align:right;" >FECHA:${fecha}</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td style="vertical-align:middle; text-align:center"><strong>CERTIFICADO MEDICO</strong></td>
          <td>&nbsp;</td>
        </tr>      
      </TABLE>
      <TABLE width="100%" BORDER="1">
          <tr>
          <td width="100%">          
      <TABLE width="100%" BORDER="0">
          <tr>
            <td NOWRAP>Nombre y Apellidos (del paciente):&nbsp;</td>
            <th colspan="4" NOWRAP>${nombre_completo}</th>    
          </tr>
          <tr>
            <td width="20%">Cedula:&nbsp;</td>
            <th style="text-align:left" width="20%">${ci}</th>
            <td width="20%">&nbsp;</td>
            <th width="20%">Sexo:&nbsp;</th>
            <th style="text-align:left" width="20%">${sx}</th>
          </tr>
          <tr>
            <td>Cargo:&nbsp;</td>
            <th colspan="4">${cargo}</th>    
            </tr>
            <tr>
              <td>Empresa:&nbsp;</td>
              <th>BRIQVEN</th>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>    
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>            
            <td NOWRAP colspan="5" style="vertical-align:middle; text-align:center;">Examen:&nbsp;<strong><u>${motivo}</u></strong></td>            
          </tr>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>    
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
          <td colspan="5" style="vertical-align:middle; text-align:center">Certifico que en el Examen M&eacute;dico Ocupacional Practicado,</td>    
          </tr>
          <tr>
            <td colspan="5" style="vertical-align:middle; text-align:center"><strong>${existeHallazgo}</strong>, Existen hallazgos cl&iacute;nicos que impidan su normal desempe&ntilde;o.</td> 
          </tr>
          <tr>        
            <td colspan="5" style="vertical-align:middle; text-align:center;">&nbsp;</td>           
          </tr>
          <tr>        
            <td colspan="5" style="vertical-align:middle; text-align:center;"><strong>DISPOSICION</strong></td>           
          </tr><tr>        
          <td colspan="5" style="vertical-align:middle; text-align:center;">&nbsp;</td>           
          </tr>
          <tr>
            <td style="vertical-align:middle; text-align:center;" >Apto para el Cargo</td>
            <td style="vertical-align:middle; text-align:left;">${check1}</td>            
            <td colspan="2" style="vertical-align:middle; text-align:center;">Apto para Disfrute de Vacaciones</td>
            <td style="vertical-align:middle; text-align:left;">${check2}</td>              
          </tr>
          <tr>
            <td style="vertical-align:middle; text-align:center;">Apto con Restricciones</td>
            <td style="vertical-align:middle; text-align:left;">${check3}</td>          
            <td colspan="2" style="vertical-align:middle; text-align:center;">Apto para Reintegro de Vacaciones</td>
            <td style="vertical-align:middle; text-align:left;">${check4}</td>     
          </tr>
          <tr>
            <td style="vertical-align:middle; text-align:center;">No Apto para el Cargo</td>
            <td style="vertical-align:middle; text-align:left;">${check5}</td>          
            <td colspan="2" style="vertical-align:middle; text-align:center;">Apto para el Reintegro de Post Incapacidad</td>
            <td style="vertical-align:middle; text-align:left;">${check6}</td>        
          </tr>
          <tr>
            <td style="vertical-align:middle; text-align:center;">Apto para Egresar</td>
            <td style="vertical-align:middle; text-align:left;">${check7}</td>
            <td colspan="3" style="vertical-align:middle; text-align:center;">&nbsp;</td>            
          </tr>
      </TABLE>
        <p>&nbsp;</p>
        <TABLE width="100%" BORDER="0"><tr>
          <td width="30%">&nbsp;</td>
          <td width="40%"><u><img align="center" src="${dirser}images/${firma_dr}"></u></td>
          <td width="30%">&nbsp;</td>
          </tr><tr>
          <td>&nbsp;</td>
          <td style="vertical-align:top; text-align:center;">______________________________</td>
          <td>&nbsp;</td>
          </tr>
          <tr>
          <td>&nbsp;</td>
          <td style="vertical-align:middle; text-align:center;">Firma del Medico Responsable</td>
          <td>&nbsp;</td>
          </tr>                  
        </TABLE>
      </td>
      </tr>
      </TABLE></body>
    </html>`;
    
    return html;
  }

  async cuerpoDelReposo(notaExamen: INotaExamen){    
    let cuerpo: string="";
    
      let enc: string="";      
      let atendio: string="";
      let colorcondicion: string="";
      
      if (notaExamen.mor_sex=='M')
        enc='<p>&nbsp;</p>Se le notifica que el Sr. ';
      else
        enc='<p>&nbsp;</p>Se le notifica que la Sra. ';
      
      cuerpo=`${enc}<strong>${notaExamen.nombre_completo}</strong>, con Cedula de Identidad <strong>${notaExamen.mor_ci}</strong>, acudi&oacute; a consulta en medicina laboral por: <strong>${notaExamen.desc_mot}</strong>.<br>`; 
      
      if (notaExamen.nom_medico == ''){
        atendio=`param&eacute;dico ocupante <strong>${notaExamen.nom_paramedico}</strong>`;
      }
      else{
        atendio=`m&eacute;dico ocupante <strong>${notaExamen.nom_medico}</strong>`;
      }
      
      if (notaExamen.mor_reposo!="N/A"){
        colorcondicion=`<font color="red"><strong>REPOSO POR ${notaExamen.mor_reposo}</strong></font>`
      };  
      
      cuerpo += `El cual est&aacute; en condici&oacute;n de ${colorcondicion} seg&uacute;n lo considerado en la consulta m&eacute;dica registrada en la fecha: <strong>${notaExamen.mor_fecha}.</strong> por el ${atendio}.<br>Cuyo diagnostico fue: <strong>${notaExamen.resultado_eva}</strong>.<br>`;

      if (notaExamen.mor_sex=='M'){
        cuerpo += 'Otros datos de inter&eacute;s sobre el trabajador:<br>';
      }
      else{  
        cuerpo += 'Otros datos de inter&eacute;s sobre la trabajadora:<br>';
      }
      
      cuerpo += `<table><thead><tr><th>Departamento:</th><th>${notaExamen.mor_depar}.</th></tr>`;
      cuerpo += `<tr><th>Cargo:</th><th>${notaExamen.mor_cargo}.</th></tr>`;
      cuerpo += `<tr><th>Supervisor:</th><th>${notaExamen.mor_nomjefe}.</th></tr></thead></table>`;
      cuerpo += '<br>';
      cuerpo += '<br>';
      cuerpo += 'Para m&aacute;s informaci&oacute;n por favor debe comunicarse con el &aacute;rea de Servicio M&eacute;dico a la Ext. Nro. 259.<p>&nbsp;</p>';
    
    return cuerpo;
  }
  
  async cuerpoDelExamen(notaExamen: INotaExamen){    
    let cuerpo: string="";
    
    let enc: string="";      
    let atendio: string="";
    let colorcondicion: string="";
    
    if (notaExamen.mor_sex=='M')
      enc='<p>&nbsp;</p>Se le notifica que el Sr. ';
    else
      enc='<p>&nbsp;</p>Se le notifica que la Sra. ';
    
    cuerpo=`${enc}<strong>${notaExamen.nombre_completo}</strong>, con Cedula de Identidad <strong>${notaExamen.mor_ci}</strong>, se realiz&oacute; el examen correspondiente a <strong>${notaExamen.desc_mot}</strong>.<br>`;	
    
    if (notaExamen.nom_medico == ''){
      atendio=`param&eacute;dico ocupante <strong>${notaExamen.nom_paramedico}</strong>`;
    }
    else{
      atendio=`m&eacute;dico ocupante <strong>${notaExamen.nom_medico}</strong>`;
    }
    
    if (notaExamen.mor_cond=="APTO"){
      colorcondicion=`<font color="green"><strong>${notaExamen.mor_cond}</strong></font>`;
    }
    else{
      colorcondicion=`<font color="red"><strong>${notaExamen.mor_cond}</strong></font>`;
    }
    
    cuerpo += `El cual est&aacute; en condici&oacute;n: ${colorcondicion} seg&uacute;n lo considerado en la consulta m&eacute;dica registrada en la fecha: <strong>${notaExamen.mor_fecha}</strong> por el ${atendio}.<br>`;

    if (notaExamen.mor_sex=='M')
      cuerpo += 'Otros datos de inter&eacute;s sobre el trabajador:<br>';
    else	
      cuerpo += 'Otros datos de inter&eacute;s sobre la trabajadora:<br>';
    
    cuerpo += `<table><thead><tr><th>Departamento:</th><th>${notaExamen.mor_depar}</th></tr>`;
    cuerpo += `<tr><th>Cargo:</th><th>${notaExamen.mor_cargo}</th></tr>`;
    cuerpo += `<tr><th>Supervisor:</th><th>${notaExamen.mor_nomjefe}</th></tr></thead></table>`;
    cuerpo += '<br>';
    cuerpo += '<br>';
    cuerpo += 'Para m&aacute;s informaci&oacute;n por favor debe comunicarse con el &aacute;rea de Servicio M&eacute;dico a la Ext. Nro. 259.<p>&nbsp;</p>';
    
    return cuerpo;
  }

  registrar(consulta: IConsultas) {
    return  this.http.post<IConsultas>(this.apiUrlConsultas + 'insert', consulta).pipe(
        tap(result => { this.consulta = result; console.log(`Consulta insertada`) }),
        catchError(this.handleError)
    );
  }

  async nuevo(consulta: IConsultas): Promise<IConsultas> {
    return await this.http.post<IConsultas>(this.apiUrlConsultas + 'insert', consulta).toPromise();    
    
  }

  actualizar(consulta: IConsultas) {
    const url = `${this.apiUrlConsultas}update/${consulta.uid}`;

    return this.http.put(url, consulta).pipe(
        tap(result => {
        }),
        catchError(this.handleError)
    );
  }

  eliminar(id: number) {
    const url = `${this.apiUrlConsultas}delete/${id}`;

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