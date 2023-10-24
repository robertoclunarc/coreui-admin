//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';

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
  
  medico: IHistoriaGral={};  
  soloLectura: boolean;
  alertsDismiss: any = [];
  searchText: string='';
  classTable: string;
  classButton: string;
  estiloOscuro: string;
  public titleButtonExport: string = 'Exportar'; 
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
            this.router.navigate(["serviciomedico/login"]);
          }
      }else{
        this.router.navigate(["serviciomedico/login"]);
      }
      
      if (this.tipoUser==='SISTEMA' || this.tipoUser==='MEDICO' || this.tipoUser==='ADMINISTRATIVO'){
        this.soloLectura=false;
      }
      else{
        this.soloLectura=true;
      }     

      this.llenarArrayHistorias('null','null','null','null','null','null','OR');
  }

  nuevo(){
    this.router.navigate(["serviciomedico/historia"]);
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
            this.returnedSearch= res;
            this.arrayHistorias= res;
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

  async obtenerData(){
    let data: any[]=[];
    for await (let hist of this.arrayHistorias){
      data.push({
        uid_historia: hist.historia.uid_historia,
        //hist.paciente.uid_paciente,
        CI: hist.paciente.ci,
        Nombre: hist.paciente.nombre,
        Apellido: hist.paciente.apellido,
        //hist.paciente.id_departamento,
        Es_contratista: hist.paciente.es_contratista, 
        FechaNac: formatDate(hist.paciente.fechanac, 'dd-MM-yyyy', this.locale), 
        Sexo: hist.paciente.sexo,
        Cargo: hist.paciente.cargo,
        Turno: hist.paciente.turno,
        Antiguedad_puesto: formatDate(hist.paciente.antiguedad_puesto, 'dd-MM-yyyy', this.locale),
        Fecha_ingreso: formatDate(hist.paciente.fecha_ingreso, 'dd-MM-yyyy', this.locale),
        Tipo_sangre: hist.paciente.tipo_sangre,
        LugarNac: hist.paciente.lugar_nac,
        EdoCivil: hist.paciente.edo_civil,
        Nacionalidad: hist.paciente.nacionalidad,
        Telefono: hist.paciente.telefono,
        Direccion_hab: hist.paciente.direccion_hab,
        //fecharegistro: hist.paciente.fecharegistro,
        Fecha_apertura: hist.historia.fecha_apertura,
        //hist.historia.fk_medico,
        Ha_sufrido_accidentes: hist.historia.ha_sufrido_accidentes,
        Partes_cuerpo_lesionados: hist.historia.partes_cuerpo_lesionados,
        Fecha_accidente: hist.historia.fecha_accidente,
        Dejo_secuelas: hist.historia.dejo_secuelas,
        Ha_padecido_enfermeda: hist.historia.ha_padecido_enfermeda,
        Cambia_trab_frecuente: hist.historia.cambia_trab_frecuente,
        Fue_certif_inpsasel: hist.historia.fue_certif_inpsasel,
        //uid_paciente: hist.historia.uid_paciente,
        Fecha_ultima_actualizacion:  hist.historia.fecha_ultima_actualizacion, //(hist.historia.fecha_ultima_actualizacion, 'dd-MM-yyyy HH:mm:ss', this.locale),      
        //hist.paciente.id_contratista,
        Mano_dominante: hist.paciente.mano_dominante,
        Frecuencia_rotacion: hist.paciente.frecuencia_rotacion,
        Nivel_educativo: hist.paciente.nivel_educativo,
        Tipo_vivienda: hist.paciente.tipo_vivienda,
        Vivienda_propia: hist.paciente.vivienda_propia,
        Medio_transp_trabajo: hist.paciente.medio_transp_trabajo,
        Alergia: hist.paciente.alergia,
        Tipo_discapacidad: hist.paciente.tipo_discapacidad,
        Desc_discapacidad: hist.paciente.desc_discapacidad,
        Estado_paciente: hist.paciente.estado_paciente,   
        //hist.depto.uid,
        Desc_CCosto: hist.depto.descripcion,
        //hist.depto.id_gerencia,
        CCosto: hist.depto.ccosto,
        //Area: hist.depto.area,    
        Examenfisico:  JSON.stringify(hist.examenfisico),
        Habitos: JSON.stringify(hist.habitos),
        Riesgos: (hist.riesgos),
        Psicologicos: JSON.stringify(hist.psicologicos),
      });
      
    }
    return data;
  }

  async exportExcel(){
    this.titleButtonExport='Descargando...'; 
    console.log(this.arrayHistorias);
    const data: any[] = await this.obtenerData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    await XLSX.writeFile(workbook, 'historialMedico.xlsx');
    this.titleButtonExport = 'Exportar';
    this.showSuccess(`Archivo Descargado. Revise su carpeta local de descargas`, 'primary');
  }
 
}