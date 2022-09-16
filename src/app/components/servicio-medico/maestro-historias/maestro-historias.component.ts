//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';

//servicios
import { HistoriaService } from '../../../services/servicio_medico/historias.service';

//modelos
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IHistoriaGral } from '../../../models/servicio-medico/historias.model';

@Component({
  selector: 'app-maestro-historias',
  templateUrl: 'maestro-historias.html',
  providers: [ { provide: AlertConfig }, HistoriaService],
  styleUrls: ["maestro-historias.css"]             
})
export class MaestroHistoriasComponent  implements OnInit  {  

  private user: IUsuarios={};
  private tipoUser: string;  
  private nuevo: boolean = false;
  medico: IHistoriaGral={};  
  soloLectura: boolean;
  private alertsDismiss: any = [];
  searchText: string='';
  classTable: string;
  classButton: string;
  estiloOscuro: string;
   
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
    {titulo: 'Historia', campo:'historia.uid_historia'},
    {titulo: 'Apertura', campo:'historia.fecha_apertura'},
    {titulo: 'Ult. Actualizacion', campo:'historia.fecha_ultima_actualizacion'},
    {titulo: 'C.I.', campo:'paciente.ci'}, 
    {titulo: 'Nombre', campo:'paciente.nombre'}, 
    {titulo: 'Apellido', campo:'paciente.apellido'}, 
    {titulo: 'Cargo', campo:'paciente.cargo'}, 
    {titulo: 'Depto.', campo:'depto.descripcion'},
    {titulo: 'Sufrió Accidente', campo:'historia.ha_sufrido_accidentes'},
    {titulo: 'Partes Lesionadas', campo:'historia.partes_cuerpo_lesionados'},
    {titulo: 'Secuelas', campo:'historia.dejo_secuelas'},
    {titulo: 'Alergia', campo:'paciente.alergia'},
    {titulo: 'Discapacidad', campo:'paciente.tipo_discapacidad'},
    {titulo: 'Exam. Fisico', campo:'examenfisico'},
    {titulo: 'Habitos', campo:'habitos'},
    {titulo: 'Riesgos', campo:'riesgos'},
    {titulo: 'Exam. Psicol.', campo:'psicologicos'},
    
  ];

  arrayHistorias: IHistoriaGral[]=[];
  returnedArray: IHistoriaGral[]=[];
  returnedSearch: IHistoriaGral[]=[];
  ciPaciente: string;
  constructor(
    private router: Router, 
    private srvHistoriaGral: HistoriaService,   
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
      
      if (this.tipoUser=='SISTEMA' || this.tipoUser=='MEDICO'){
        this.soloLectura=false;
      }
      else{
        this.soloLectura=true;
      }     

      this.llenarArrayHistorias('null','null','null','null','null','null','OR');
  }

  private async llenarArrayHistorias(idHistoria: string, idPaciente: string, ci:string, nombre: string, cargo: string, depto:string, condlogica: string) {
    
		this.srvHistoriaGral.searchHistoriasPromise(idHistoria, idPaciente, ci, nombre, cargo, depto, condlogica)			
			.then(results => {				
				
				this.arrayHistorias = results;        
        this.totalItems = this.arrayHistorias.length;
        this.maxSize = Math.ceil(this.totalItems/this.numPages);             
        this.returnedArray = this.arrayHistorias.slice(0, this.numPages);
        
			})
			.catch(err => { console.log(err) });
	}
  
  async showModalRegistrar(){
    this.ciPaciente="-1";    
  }

  async showModalActualizar(item: IHistoriaGral){
    
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
      /*
      let date_regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
      let testDate = this.searchText;
      let fecha: string='null';
      if (date_regex.test(testDate)) {
        fecha=searchValue;
      }
      */
      
      await this.srvHistoriaGral.searchHistoriasPromise(searchValue, searchValue, searchValue, searchValue, searchValue, searchValue, 'OR')        
      .then(async (res) => {          
            this.returnedSearch= res            
            this.totalItems = this.returnedSearch.length;            
            this.returnedArray = this.returnedSearch.slice(0, this.numPages);            
            this.maxSize = Math.ceil(this.totalItems/this.numPages);
            //console.log(this.returnedSearch)
          });               
    }
    else { 
      this.totalItems = this.arrayHistorias.length;
      this.returnedArray = this.arrayHistorias;      
      this.returnedArray = this.returnedArray.slice(0, this.numPages);
      this.maxSize = Math.ceil(this.totalItems/this.numPages);     
       
    } 
  }
  
  pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    if(this.searchText== "")
      this.returnedArray = this.arrayHistorias.slice(this.startItem, this.endItem);
    else
      this.returnedArray = this.returnedSearch.slice(this.startItem, this.endItem);
   
  }

  sortTable(prop: string) {
     
      if(this.searchText== ""){        
        if (this.sortOrder==1)
          {this.returnedArray = this.arrayHistorias.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(0, this.numPages);}
        else
          {this.returnedArray = this.arrayHistorias.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(0, this.numPages);}        
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

  outMedicoEvent(entrada: IHistoriaGral){
    
    if (entrada){
      this.llenarArrayHistorias('null','null','null','null','null','null','OR');
    }
  }
 
}