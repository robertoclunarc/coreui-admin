//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';

//servicios
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

//modelos
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IvPaciente, IPaciente } from '../../../models/servicio-medico/paciente.model';

@Component({
  selector: 'app-maestro-paciente',
  templateUrl: 'maestro-paciente.html',
  providers: [ { provide: AlertConfig }, PacientesService],
  styleUrls: ["maestro-paciente.css"]             
})
export class MaestroPacienteComponent  implements OnInit  {  

  private user: IUsuarios={};
  private tipoUser: string;  
  private nuevo: boolean = false;
  paciente: IvPaciente={};  
  soloLectura: boolean=false;
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
    {titulo: 'Nro.', campo:'uid'}, {titulo: 'Fecha', campo:'fecha'}, {titulo: 'Cedula', campo:'ci'}, {titulo: 'Nombre', campo:'nombre_completo'},{titulo: 'Sexo', campo:'sexo'}, 
    {titulo: 'Cargo', campo:'cargo'}, {titulo: 'Motivo', campo:'motivo'}, {titulo: 'Paramedico', campo:'paramedico'}, {titulo: 'Atendido por', campo:'login_atendio'}
  ];

  constructor(
    private router: Router, 
    private srvPacientes: PacientesService,   
    @Inject(LOCALE_ID) public locale: string,  
    ) {  }

  ngOnInit(): void {

    this.classTable = "table table-striped";
  }

  
  async registrar(){
       
    
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
  
  pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    /*if(this.searchText== "")
      this.returnedArray = this.consultasTodas.slice(this.startItem, this.endItem);
    else
      this.returnedArray = this.returnedSearch.slice(this.startItem, this.endItem);
   */
  }

  sortTable(prop: string) {
    
      /*if(this.searchText== ""){        
        if (this.sortOrder==1)
          this.returnedArray = this.consultasTodas.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(0, this.numPages);
        else
          this.returnedArray = this.consultasTodas.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(0, this.numPages);        
      }
      else{
        if (this.sortOrder==1)  
          this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);
        else
          this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);         
      }        
      this.sortOrder =  this.sortOrder * (-1);*/
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