//componentes
import { Component, OnInit,Inject,  LOCALE_ID } from '@angular/core';
//import { ModalDirective} from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

//servicios
import { ConsultasService } from '../../../services/servicio_medico/consultas.service';
import { CorreoService } from '../../../services/servicio_medico/correo.service';

//modelos
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IFiltroConsulta, IvMorbilidad } from '../../../models/servicio-medico/consultas.model';
import { ImailOptions } from '../../../models/servicio-medico/correo.model';

@Component({
  selector: 'app-morbilidad',
  templateUrl: 'morbilidad.component.html',
  providers: [ { provide: AlertConfig }, ConsultasService],
  styleUrls: ["morbilidad.component.css"]             
})
export class MorbilidadComponent  implements OnInit  {  
  
  private user: IUsuarios={};
  private tipoUser: string;  
  public classTable: string;
  public classButton: string;
  public estiloOscuro: string;
  private buscarConsulta: IFiltroConsulta;
  fInicio: string ="";
  fFin: string="";
  vMorbilidad: IvMorbilidad[]=[];
  returnedArray: IvMorbilidad[]=[];  
  returnedSearch: IvMorbilidad[]=[];
  searchTimeout: any;
  soloLectura: boolean=false;
  searchText = "";
  public titleButtonSend: string = 'Enviar';
  public titleButtonExport: string = 'Exportar';
  alertsDismiss: any = [];
  totalItems: number;//total number of items in all pages
  //currentPage: number   = 1;
  //smallnumPages: number;
  maxSize: number;//limit number for page links in pager
  //bigTotalItems: number = 0;
  //bigCurrentPage: number = 1;
  numPages: number = 10;//se activa cuando cambia el recuento total de páginas, $event:number es igual al recuento total de páginas
  //currentPager: number   = 10;

  startItem: number;
  endItem: number;
  private sortOrder = 1;
  html: string = `<span class="btn btn-warning">Never trust not sanitized <code>HTML</code>!!!</span>`; 

  titulos = [
    {titulo: 'Nro.', campo:'uid'}, {titulo: 'Fecha', campo:'fecha'}, {titulo: 'Turno', campo:'turno'}, {titulo: 'Cédula', campo:'ci'}, 
    {titulo: 'Nombre', campo:'nombre_completo'},{titulo: 'Sexo', campo:'sexo'}, {titulo: 'Cargo', campo:'cargo'}, 
    {titulo: 'Supervisor', campo:'nombres_jefe'}, {titulo: 'Area', campo:'area'}, {titulo: 'Motivo', campo:'motivo'},
    {titulo: 'P/S', campo:'fktipoconsulta'}, {titulo: 'Afección por Sist.', campo:'resultado_eva'}, {titulo: '', campo:''}, {titulo: 'Diag.', campo:'descripcion_afeccion'},
    {titulo: 'Condición|Observación', campo:'motivo_consulta'}, {titulo: 'Medicamento(s)', campo:'aplicacion'}, {titulo: 'Asistenciado', campo:'login_atendio'},
    {titulo: 'Dir. Habitación', campo:'direccion_hab'}, {titulo: 'Mano Domte.', campo:'mano_dominante'}, {titulo: 'Talla', campo:'talla'},
    {titulo: 'Peso', campo:'peso'}, {titulo: 'IMC', campo:'imc'}, {titulo: 'Edad', campo:'edad'}
  ];
  
  constructor(
    private router: Router, 
    private srvConsultas: ConsultasService,
    private srvCorreo: CorreoService,
    @Inject(LOCALE_ID) public locale: string,  
    ) {  }

  async ngOnInit() {
    
    if (sessionStorage.modoOscuro===undefined || sessionStorage.modoOscuro==='Off'){
      this.classTable = "table table-striped";
      this.classButton ="btn btn-sm btn-ghost-dark";
      this.estiloOscuro="";
    }
    else { 
      this.classTable = sessionStorage.classTable;
      this.classButton ="btn btn-sm btn-ghost-dark active";
    }
    
    if (sessionStorage.currentUser){
        this.user=JSON.parse(sessionStorage.currentUser);
        if (this.user) { 
          this.tipoUser= sessionStorage.tipoUser;
        }
        else {
          this.router.navigate(["serviciomedico/login"]);
        }
    }else{
      this.router.navigate(["serviciomedico/login"]);
    }
    await this.limpiarFiltro();
    this.fInicio = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
    this.fFin = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
    this.buscarConsulta.fechaIni=this.fInicio;
    this.buscarConsulta.fechaFin=this.fFin;
    this.morbilidadFilter(false);
  }
  
  async morbilidadFilter(conFechaActual?: boolean) {
    this.searchText = conFechaActual ? formatDate(Date.now(), 'yyyy-MM-dd', this.locale) : "";
    this.buscarConsulta.fecha = conFechaActual ? this.searchText : 'null';
    
		return await this.srvConsultas.morbilidadFilter(this.buscarConsulta)
			.toPromise()
      .then(results => {
				this.vMorbilidad = results;
        
        this.totalItems = this.vMorbilidad.length;
        this.maxSize = Math.ceil(this.totalItems/this.numPages);
        this.returnedArray = this.vMorbilidad.slice(0, this.numPages);
			})
			.catch(err => { console.log(err) });
	}

  private async limpiarFiltro(){
    this.buscarConsulta = { 
      uidConsulta: 'null',
      ciPaciente: 'null',
      Motivo: 'null',
      uidMotivo: 'null',
      fechaIni: 'null',
      fechaFin: 'null',
      Medico: this.tipoUser==='SISTEMA' || this.tipoUser==='MEDICO' || this.tipoUser==='ADMINISTRATIVO' ? 'null' : this.user.login,
      Paramedico: 'null',
      nombrePaciente: 'null',
      cargo: 'null',
      fecha: 'null',
      condlogica: 'null',
      patologia: 'null'
    }
  }

  async mostrarTodo(){
    await this.limpiarFiltro();
    this.searchText = "";
    this.fInicio = "";
    this.fFin = "";
    this.morbilidadFilter(false);
  }

  SearchFecha(){    
    if (this.fInicio && this.fFin){
      const fechaInicio = new Date(this.fInicio);
      const fechaFin = new Date(this.fFin);

      if (fechaFin >= fechaInicio) {
        this.buscarConsulta.fechaIni = this.fInicio;
        this.buscarConsulta.fechaFin = this.fFin;
        this.morbilidadFilter(false);
      }      
    }    
  }

  async Search(){
    // Borra el temporizador si ya se había iniciado uno
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Inicia un nuevo temporizador
    this.searchTimeout = setTimeout(() => {
      // Verifica que searchText tenga al menos 3 caracteres
      if (this.searchText.length >= 2) {
        // Realiza la búsqueda aquí
        this.performSearch();
      }
    }, 3000); // Espera 2 segundos      
  }

  performSearch(){
    
    if(this.searchText!==""){
      
      let searchValue = this.searchText.toLocaleLowerCase();

      let date_regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
      let testDate = this.searchText;
      let fecha: string='null';
      
      if (date_regex.test(testDate)) {
        fecha=searchValue;       
      }
      
      this.buscarConsulta = { 
        uidConsulta: fecha==='null' ? searchValue : 'null',
        ciPaciente: fecha==='null' ? searchValue : 'null',
        Motivo: fecha==='null' ? searchValue : 'null',
        uidMotivo: fecha==='null' ? searchValue : 'null',
        fechaIni: this.fInicio,
        fechaFin: this.fFin,
        Medico: this.tipoUser==='PARAMEDICO' ? this.user.login : 'null',
        Paramedico: fecha==='null' ? searchValue : 'null',
        nombrePaciente: fecha==='null' ? searchValue : 'null',
        cargo: fecha==='null' ? searchValue : 'null',
        fecha: 'null',
        condlogica:  'OR',
        patologia: this.tipoUser==='PARAMEDICO' ? 'null' : searchValue,
      } 
      this.returnedSearch=[];
      this.srvConsultas.morbilidadFilter(this.buscarConsulta)
      .toPromise()
      .then(async (res) => {
            
            this.returnedSearch= res;            
            this.totalItems = this.returnedSearch.length;
            this.returnedArray = this.returnedSearch.slice(0, this.numPages);
            this.maxSize = Math.ceil(this.totalItems/this.numPages);
          });
    }
    else {
      this.totalItems = this.vMorbilidad.length;
      this.returnedArray = this.vMorbilidad;
      this.returnedArray = this.returnedArray.slice(0, this.numPages);
      this.maxSize = Math.ceil(this.totalItems/this.numPages);
    }
  }

  pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    if(this.searchText== "")
      this.returnedArray = this.vMorbilidad.slice(this.startItem, this.endItem);
    else
      this.returnedArray = this.returnedSearch.slice(this.startItem, this.endItem);
   
  }

  sortTable(prop: string) {    
      if(this.searchText == "" || this.returnedSearch===undefined){        
        if (this.sortOrder==1)
          this.returnedArray = this.vMorbilidad.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(0, this.numPages);
        else
          this.returnedArray = this.vMorbilidad.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(0, this.numPages);        
      }
      else{
        if (this.sortOrder==1){
          this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);
        }
        else{          
          this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);
        }        
      }        
      this.sortOrder =  this.sortOrder * (-1);
  }

  sortData (a: any, b: any, prop: string, type = ""){    
    if (type === "date" || type === 'string') {
      
      if (a[prop] > b[prop]) {
        return 1;
      }
      if (a[prop] < b[prop]) {
        return -1;
      }
      // a must be equal to b
      return 0;
    }
    else{
      return a[prop] - b[prop]
    }
  }

  async getRemitentes(actividad: string){
    let data: string[]=[];    
    await this.srvCorreo.remitentes(actividad)
      .toPromise()
      .then(async (res) => {
        data = res;
      })
    return data;
  }

  obtenerArchivo(): Promise<Blob> {
    return new Promise(async (resolve, reject)  => {
      
      const data: any[] = await this.morbilidad();
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      const archivo = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      resolve(archivo);
    });
  }

  async enviarCorreo(mailOptions: ImailOptions) {    
    let respuesta: any;      
    await this.obtenerArchivo().then(async (archivo: Blob) => {
      const formData = new FormData();
      formData.append('attachments', archivo, 'atencion.xlsx');
      formData.append('to', mailOptions.to);
      formData.append('subject', mailOptions.subject);
      formData.append('text', mailOptions.text);      
      respuesta = await this.srvCorreo.enviarAchivo(formData);
      if (respuesta.error==undefined){
        console.log(`Info: ${respuesta?.info}`);
      }else{
        console.log(`Error: ${respuesta.error}`);
      }
    });    
    return respuesta;  
  }

  async enviarMorbilidad(actividad: string){   
    this.titleButtonSend='Enviando...'; 
    const remitentes: string[] = await this.getRemitentes(actividad);
    
    if (remitentes.length>0){
      const correos: string = remitentes.toString();
      const mailOptions: ImailOptions = {
        to: correos,
        subject: `${actividad}: ${this.user.nombres}  ${formatDate(Date.now(), 'dd-MM-yyyy HH:mm', this.locale)}`,
        text: `Reporte de ${actividad} desde el usuario:  ${this.user.login}  (ver archivo adjunto).`,
      };
      await this.enviarCorreo(mailOptions)
      .then((result) => {
        if (result.info)
          this.showSuccess(`${actividad} Enviada a: ${correos}`, 'warning');
        else
          this.showSuccess(`Error: ${result?.error}`, 'danger');
        this.titleButtonSend = 'Enviar';
      })
    }
  }

  async morbilidad(){
    let data: any[]=[];
    let morbilidad: IvMorbilidad[]=[];
    let edad: any;
    
    await this.srvConsultas.morbilidadFilter(this.buscarConsulta)
      .toPromise()            
      .then(async (res) => {
        morbilidad = res;        
        for await (let p of morbilidad){          
          edad = JSON.parse(JSON.stringify(p.edad));          
          data.push({
            Id: p.uid,
            FechaConsulta: formatDate(p.fecha, 'dd-MM-yyyy HH:mm:ss', this.locale),
            turno: p.turno,
            Cedula: p.ci,
            Nombres: p.nombre_completo,
            Sexo: p.sexo,
            edad: edad?.years,           
            Cargo: p.cargo,
            Departamento: p.departamento,
            Supervisor: p.nombres_jefe,
            ManoDominante: p.mano_dominante,
            AreaIncidente: p.area,
            TipoDiagnostico: p.descripciondiagnostico,
            Motivo: p.motivo,
            'P/S': p.fktipoconsulta==1 ? 'P' : 'S',
            'Tipo Afeccion por Sist.': p.resultado_eva,
            Diagnostico: p.descripcion_afeccion,
            'Condicion / Observ.': p.motivo_consulta,
            Patologias: p.patologia,            
            FResp: p.fresp,
            Pulso: p.pulso,
            Temp: p.temper,
            TArt: p.tart,
            Talla: p.talla,
            Peso: p.peso,
            IMC: p.imc,
            FCard: p.fcard,
            Reposo: p.reposo,            
            Medicamentos: p.aplicacion!=null && p.aplicacion!=undefined ? p.aplicacion.toString() : '',            
            Medico: p.medico,
            CiMedico: p.ci_medico,
            Paramedico: p.paramedico,
            DirHabitacion: p.direccion_hab
          })
        }
      })
    return data;
  }

  async exportExcel(){
    this.titleButtonExport='Descargando...';    
    const data: any[] = await this.morbilidad();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    await XLSX.writeFile(workbook, 'atencion.xlsx');
    this.titleButtonExport = 'Exportar';
    this.showSuccess(`Archivo Descargado. Revise su carpeta local de descargas`, 'primary');
  }

  showSuccess(mensaje: any, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 6000
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  } 
 
}