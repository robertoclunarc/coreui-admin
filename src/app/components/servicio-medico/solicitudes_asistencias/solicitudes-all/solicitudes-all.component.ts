import { Component, OnInit, Inject,  LOCALE_ID, ViewChild } from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';

//modelos
import { IFilterSolicitud, ISolicitudesAtenciones } from '../../../../models/servicio-medico/solicitudatencion.model';
import { IConsultas } from '../../../../models/servicio-medico/consultas.model';
import { IParamedicos } from '../../../../models/servicio-medico/medicos.model';
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';

//servicios
import { SolicitudAtencionService } from '../../../../services/servicio_medico/solicitudatencion.service';
import { ConsultasService } from '../../../../services/servicio_medico/consultas.service';
import { MedicosService } from '../../../../services/servicio_medico/medicos.service';

@Component({
  selector: 'app-solicitudes-all',
  templateUrl: './solicitudes-all.component.html',
  styleUrls: ['./solicitudes-all.component.css'],
  providers: [ SolicitudAtencionService, 
    { provide: AlertConfig }],
})
export class SolicitudesALLComponent implements OnInit {
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  constructor(    
    private router: Router,    
    private srvSolicitud: SolicitudAtencionService,
    private srvConsultas: ConsultasService,
    private srvMedicos: MedicosService,
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }  
  
  titulos = [
    {titulo: 'ID', campo:'uid'}, {titulo: 'C.I.', campo:'ci_paciente'}, {titulo: 'Nombre', campo:'paciente'}, 
    {titulo: 'F.Solicitud', campo:'fecha_solicitud'}, {titulo: 'F.Atención', campo:'fecha_atencion'}, 
    {titulo: 'F.Salida', campo:'fecha_salida'}, {titulo: 'Motivo', campo:'motivo'}, {titulo: 'Estatus', campo:'estatus'}, 
    {titulo: 'Consultas', campo:'consultas'}, {titulo: 'Prox.Cita', campo:'fecha_prox_cita'}, {titulo: 'Observaciones', campo:'observaciones'}, 
    {titulo: 'Obs.Supervisor', campo:'observacion_sup'}, {titulo: 'Reposo', campo:'reposo'}, {titulo: 'Paramédico', campo:'paramedico'}, 
    {titulo: 'Médico', campo:'medico'}, {titulo: 'Supervisor', campo:'nombres_jefe'}
  ];
  filtroSolicitud: IFilterSolicitud={};
  //paciente: IPacienteConSupervisores={};
  solicitudesAll: ISolicitudesAtenciones[]=[];
  returnedArray: ISolicitudesAtenciones[]=[];
  returnedSearch: ISolicitudesAtenciones[]=[];
  solicitudOne: ISolicitudesAtenciones={}; 
  private user: IUsuarios={};
  private tipoUser: string; 
  alertaRegistrar: string=""; 
  titleRegistrar: string="";
  private sortOrder = 1;
  alertsDismiss: any = [];
  searchText: string='';
  classTable: string;
  classButton: string;
  estiloOscuro: string;  
  private searchTimeout: any;
  idConsulta: string;
  show = false;
  autohide = true;
  planilla: string;
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

  ngOnInit(): void {
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
    
    if (sessionStorage.modoOscuro==undefined || sessionStorage.modoOscuro=='Off'){
      this.classTable = "table table-striped";
      this.classButton ="btn btn-block btn-ghost-dark";
      this.estiloOscuro="";
    }
    else {
      this.classTable = sessionStorage.classTable;
      this.classButton ="btn btn-block btn-ghost-dark active";      
    }
    this.filtroSolicitud.fecha_solicitud = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
    this.filtroSolicitud.estatus = 'PENDIENTE';
    this.filtroSolicitud.condlogica = 'OR';
    //console.log(`filtroSolicitud.fecha_solicitud: ${this.filtroSolicitud.fecha_solicitud}`);
    this.llenarArraySolicitudes();
  }
  
  private async llenarArraySolicitudes() {
    
		this.srvSolicitud.searchSolicitudesPromise(this.filtroSolicitud)			
			.then(results => {				
				this.solicitudesAll = results;        
        this.totalItems = this.solicitudesAll.length;
        this.maxSize = Math.ceil(this.totalItems/this.numPages);             
        this.returnedArray = this.solicitudesAll.slice(0, this.numPages);
        console.log(this.returnedArray)
			})
			.catch(err => { console.error(err) });
	}

  mostrarTodo(){
    this.filtroSolicitud={};
    this.llenarArraySolicitudes();
  }

  displayToday(){
    this.filtroSolicitud={};
    this.filtroSolicitud.fecha_solicitud = formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
    this.filtroSolicitud.estatus = 'PENDIENTE';
    this.filtroSolicitud.condlogica = 'AND';
    this.llenarArraySolicitudes();
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
    }, 2000); // Espera 2 segundos      
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
      this.filtroSolicitud = {};
      this.filtroSolicitud = { 
        uid: fecha==='null' ? searchValue : 'null',
        ciPaciente: fecha==='null' ? searchValue : 'null',
        nombre: fecha==='null' ? searchValue : 'null',
        supervisor: fecha==='null' ? searchValue : 'null',
        fecha_solicitud: fecha,
        medico: fecha==='null' ? searchValue : 'null',
        paramedico: fecha==='null' ? searchValue : 'null',
        estatus: fecha==='null' ? searchValue : 'null',
        condlogica: 'OR'      } 
      this.returnedSearch=[];
      this.srvSolicitud.searchSolicitudesPromise(this.filtroSolicitud)
      .then(async (res) => {
            
            this.returnedSearch= res;            
            this.totalItems = this.returnedSearch.length;
            this.returnedArray = this.returnedSearch.slice(0, this.numPages);
            this.maxSize = Math.ceil(this.totalItems/this.numPages);
          });
    }
    else {
      this.totalItems = this.solicitudesAll.length;      
      this.returnedArray = this.solicitudesAll.slice(0, this.numPages);
      this.maxSize = Math.ceil(this.totalItems/this.numPages);
    }
  }

  darAtencion(uid: number){
    this.router.navigate([`serviciomedico/atenciones/${uid}`]);
  }

  async irConsulta(uid: string){
    try {
      this.idConsulta = undefined;
      const consulta: IConsultas = await this.srvConsultas.consultasOne(Number(uid)).toPromise();
      const paramedico: IParamedicos = await this.srvMedicos.paraMedicosOne(consulta.id_paramedico).toPromise();
      if (paramedico && (this.user.nivel===1 || this.user.login===paramedico.login)){
        console.log(uid);
        this.idConsulta=uid;      
        this.primaryModal.show();
      }else{
        this.showSuccess('NO tiene permiso para ver esta Consulta!', 'danger');
      }
    } catch (error) {
      this.showSuccess('Lo siento hubo un problema. consulte con el Dpto. TI', 'danger');
      console.error(error)
    }        
  }

  pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    if(this.searchText== "")
      this.returnedArray = this.solicitudesAll.slice(this.startItem, this.endItem);
    else
      this.returnedArray = this.returnedSearch.slice(this.startItem, this.endItem);
  }

  sortTable(prop: string) {     
      if(this.searchText== ""){        
        if (this.sortOrder==1)
          {this.returnedArray = this.solicitudesAll.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(0, this.numPages);}
        else
          {this.returnedArray = this.solicitudesAll.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(0, this.numPages);}        
      }
      else{
        if (this.sortOrder==1)  
          {this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);}
        else
          {this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);}         
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

  public downloadAsPDF(sol: ISolicitudesAtenciones) {
    this.solicitudOne=sol;
  }

  showSuccess(mensaje: string, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 7 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 7000
    });
  }  

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }

}
