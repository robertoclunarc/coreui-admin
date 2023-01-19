//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';

//servicios
import { ProtocolosEndocrinosService } from '../../../services/servicio_medico/protocolo_endocrino.service';

//modelos
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IPaciente } from '../../../models/servicio-medico/paciente.model';
import { filtroProtoEndocrino, IEvaluaciones_endocrinas, IPosibles_resp_endocrinas, IProtocolosEndrocrinos, IRespuestas_pacientes_eval_endocrino , IvProtocoloEndrocrinos } from '../../../models/servicio-medico/protocolo_endocrino.model';

@Component({
  selector: 'app-protocolo-endocrino',
  templateUrl: 'protocolo-endocrino.html',
  providers: [ { provide: AlertConfig }, ProtocolosEndocrinosService],
  styleUrls: ["protocolo-endocrino.css"]             
})
export class ProtocoloEndocrinoComponent  implements OnInit  {  

  private user: IUsuarios={};
  private tipoUser: string;  
  private nuevo: boolean = false;
  paciente: IPaciente={};  
  soloLectura: boolean;
  private alertsDismiss: any = [];
  searchText: string='';
  classTable: string;
  classButton: string;
  estiloOscuro: string;
  filtro: filtroProtoEndocrino={} 
  show = false;
  autohide = true;

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
    {titulo: 'C.I.', campo:'protocolo.paciente.ci'}, 
    {titulo: 'Nombre', campo:'protocolo.paciente.nombre'},
    {titulo: 'Sexo', campo:'protocolo.paciente.sexo'}, 
    {titulo: 'Emision', campo:'protocolo.protocolo.emision'}, 
    {titulo: 'Vigencia', campo:'protocolo.vigencia'}, 
    {titulo: 'Cargo', campo:'protocolo.paciente.cargo'},                       
    {titulo: 'Med. Evaluador', campo:'medico.nombre'}
  ];

  arrayProtocolo: IvProtocoloEndrocrinos[]=[];
  returnedArray: IvProtocoloEndrocrinos[]=[];
  returnedSearch: IvProtocoloEndrocrinos[]=[];
  ciPaciente: string;
  constructor(
    private router: Router, 
    private srvProtocoloEndocrino: ProtocolosEndocrinosService,   
    @Inject(LOCALE_ID) public locale: string,  
    ) {  }

  ngOnInit(): void {

    if (sessionStorage.modoOscuro==undefined || sessionStorage.modoOscuro=='Off'){
        this.classTable = "table table-striped";
        this.classButton ="btn btn-block btn-ghost-dark";
        this.estiloOscuro="";
      }
      else {
        this.classTable = sessionStorage.classTable;
        this.classButton ="btn btn-block btn-ghost-dark active";      
      }
      
      if (sessionStorage.currentUser){
          this.user=JSON.parse(sessionStorage.currentUser);
          if (this.user) {             
            this.tipoUser= sessionStorage.tipoUser;
          }
          else {
            this.router.navigate(["login"]);
          }
      }else{
        this.router.navigate(["login"]);
      }
      
      if (this.tipoUser=='MEDICO' || this.tipoUser=='SISTEMA' || this.tipoUser=='ADMPERSONAL'){
        this.soloLectura=false;
      }
      else{
        this.soloLectura=true;
      }     
      this.filtro={ ciPaciente: 'null', idProtocolo: 'null', fechaIni: 'null',  fechaFin: 'null',  medico: 'null',  uidPaciente: 'null', condlogica: 'OR' }
      this.llenarArrayProtocolos();
  }

  private async llenarArrayProtocolos() {
    await this.srvProtocoloEndocrino.consultaFilter(this.filtro)
		//this.srvPacientes.searchPacientesPromise(ciPaciente, nombre, supervisor, cargo, dpto,condlogica)			
			.then(results => {				
				
				this.arrayProtocolo = results;        
        this.totalItems = this.arrayProtocolo.length;
        this.maxSize = Math.ceil(this.totalItems/this.numPages);             
        this.returnedArray = this.arrayProtocolo.slice(0, this.numPages);
			})
			.catch(err => { console.log(err) });
	} 

  
  async showModalRegistrar(){
    this.ciPaciente="-1";    
  }

  async  showModalActualizar(item: IvProtocoloEndrocrinos){
    
    this.ciPaciente=item.paciente.ci;
  }

  showSuccess(mensaje: any, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }

  async Search(){
    
    if(this.searchText!== ""){

      let searchValue = this.searchText.toLocaleLowerCase();

      //tratamiento para fechas------------------------------
      
      let date_regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
      let testDate = this.searchText;
      let fecha: string='null';
      if (date_regex.test(testDate)) {
        fecha=searchValue;
      }
      
      this.filtro={ ciPaciente: searchValue, idProtocolo: searchValue, fechaIni: fecha,  fechaFin: fecha,  medico: searchValue,  uidPaciente: 'null', condlogica: 'OR' }
      await this.srvProtocoloEndocrino.consultaFilter(this.filtro)      
      .then(async (res) => {          
            this.returnedSearch= res            
            this.totalItems = this.returnedSearch.length;            
            this.returnedArray = this.returnedSearch.slice(0, this.numPages);            
            this.maxSize = Math.ceil(this.totalItems/this.numPages);
          });               
    }
    else { 
      this.totalItems = this.arrayProtocolo.length;
      this.returnedArray = this.arrayProtocolo;      
      this.returnedArray = this.returnedArray.slice(0, this.numPages);
      this.maxSize = Math.ceil(this.totalItems/this.numPages);     
       
    } 
  }
  
  pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    if(this.searchText== "")
      this.returnedArray = this.arrayProtocolo.slice(this.startItem, this.endItem);
    else
      this.returnedArray = this.returnedSearch.slice(this.startItem, this.endItem);
   
  }

  sortTable(prop: string) {
     
      if(this.searchText== ""){        
        if (this.sortOrder==1)
          {this.returnedArray = this.arrayProtocolo.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(0, this.numPages);}
        else
          {this.returnedArray = this.arrayProtocolo.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(0, this.numPages);}        
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
 
}