//componentes
import { Component, ViewChild, OnInit, SecurityContext } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';

//servicios
import { ConsultasService } from '../../services/consultas.service';
import { PacientesService } from '../../services/pacientes.service';
import { MedicosService } from '../../services/medicos.service';
import { MotivosService } from '../../services/motivos.service';
import { AreasService } from '../../services/areas.sevice';
import { PatologiasService } from '../../services/patologias.service';
import { AfeccionesService } from '../../services/afecciones.service';
import { SignosVitalesService } from '../../services/signosvitales.service';
import { RemitidosService } from '../../services/remitidos.service';
import { TiempoReposoService } from '../../services/tiemporeposos.service';
import { AntropometriaService } from '../../services/antropometria.service';

//modelos
import { IConsultas, IConsultasConstraint, IvConsulta, IFiltroConsulta, Ireferencia } from '../../models/consultas.model';
import { IsignosVitales } from '../../models/signos_vitales.model';
import { Iantropometria  } from '../../models/antropometria.model';
import { IvPaciente } from '../../models/paciente.model';
import { IMedicos, IParamedicos } from '../../models/medicos.model';
import { IMotivo } from '../../models/motivos.model';
import { IAreas } from '../../models/areas.model';
import { IPatologia } from '../../models/patologias.model';
import { IAfecciones } from '../../models/afecciones.model';
import { IRemitido } from '../../models/remitidos.model';
import { ITiempoReposo } from '../../models/tiemporeposos.model';

/*

import { CarouselConfig } from 'ngx-bootstrap/carousel';
*/

@Component({
  templateUrl: 'consultas.component.html',
  providers: [ConsultasService, PacientesService, MedicosService, MotivosService, AreasService, PatologiasService, 
              AfeccionesService, SignosVitalesService, RemitidosService, TiempoReposoService, AntropometriaService,
              { provide: AlertConfig }],  
})
export class ConsultasComponent  implements OnInit  {
  // PolarArea
  private polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  private polarAreaChartData: number[] = [300, 500, 100, 40, 120];
  private polarAreaLegend = true;
  private polarAreaChartType = 'polarArea';

  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';

  isCollapsed_1: boolean = true;
  iconCollapse_1: string = 'icon-arrow-down';

  private buscarConsulta: IFiltroConsulta;
  private consultasTodas: IvConsulta[];
  private returnedArray: IvConsulta[];
  private returnedSearch: IvConsulta[];
  private consultas: IConsultas={};
  private vConsultas: IvConsulta={};
  private signoVital: IsignosVitales={};
  private antropometria: Iantropometria={};
  private paciente: IvPaciente={};
  private newConsulta: boolean=false;
  private alertsDismiss: any = [];
  private medicos: IMedicos[]=[];
  private paramedicos: IParamedicos[]=[];
  private selectMedicos: IMedicos[]=[];
  private selectParamedicos: IParamedicos[]=[];
  private motivos: IMotivo[]=[];
  private areas: IAreas[]=[];
  private selectedPatolog: string;
  private patologias: IPatologia[] = [];
  private afecciones: IAfecciones[]=[];
  private selectedOptionPatolog: any;  
  private searchText = ""; 
  private modalTitle = "";
  private autorizacion: boolean = true;
  private remitidos: IRemitido[]=[];
  private tiemposReposo: ITiempoReposo[]=[];
  private referencia: Ireferencia={};
  private arrayReferencias: Ireferencia[]=[];
  private alertaReferencia: string=""; 
  private titleReferencia: string="";
  private alertaMedicamento: string=""; 
  private titleMedicamento: string="";
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

  private titulos = [
    {titulo: 'Nro.', campo:'uid'}, {titulo: 'Fecha', campo:'fecha'}, {titulo: 'Cedula', campo:'ci'}, {titulo: 'Nombre', campo:'nombre_completo'},{titulo: 'Sexo', campo:'sexo'}, 
    {titulo: 'Cargo', campo:'cargo'}, {titulo: 'Motivo', campo:'motivo'}, {titulo: 'Paramedico', campo:'paramedico'}, {titulo: 'Atendido por', campo:'login_atendio'}
  ];

  private condiciones =[
    {valor:'N/A', display:'No Aplica'}, {valor: 'APTO', display:'APTO'},
    {valor:'NO APTO', display:'NO APTO'}, {valor:'APTO RESTR', display:'APTO CON RESTRICCIONES'}
  ];

  constructor(
    private srvConsultas: ConsultasService,
    private srvPacientes: PacientesService,
    private srvMedicos: MedicosService,
    private srvMotivo: MotivosService,
    private srvArea: AreasService,
    private srvPatologia: PatologiasService,
    private srvAfeccion: AfeccionesService,
    private srvSignosVitales: SignosVitalesService,
    private srvRemitidos: RemitidosService,
    private srvTiempoReposo: TiempoReposoService,
    private srvAntropometria: AntropometriaService,
       
    ) {  }

  ngOnInit(): void {    
		this.llenarArrayConsultas();
    this.llenarArrayMedicos();
    this.llenarArrayMotivos();
    this.llenarArrayAreas();
    this.llenarArrayPatologias();
    this.llenarArrayAfecciones();
    this.llenarArrayRemitidos();
    this.llenarArrayTiempoReposo();
	}

  private async limpiarFiltro(){
     this.buscarConsulta = { 
      uidConsulta: 'null',
      uidPaciente: 'null',
      uidMotivo: 'null',
      fechaIni: 'null',
      fechaFin: 'null',
      ciMedico:'null',
      ciParamedico: 'null'
    }
  }

  private async consultasFilter() {
    
		return await this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()			
			.catch(err => { console.log(err) });
	}
  
  private async llenarArrayConsultas() {
    this.limpiarFiltro();
		this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()
			.then(results => {				
					
				this.consultasTodas = results;       
        
        this.totalItems = this.consultasTodas.length;
        this.maxSize = Math.ceil(this.totalItems/this.numPages);             
        this.returnedArray = this.consultasTodas.slice(0, this.numPages);            
				
			})
			.catch(err => { console.log(err) });
	}  

  // events
  private chartClicked(e: any): void {
    console.log(e);
  }

  private chartHovered(e: any): void {
    console.log(e);
  }

  private llenarArrayPatologias(){
    this.srvPatologia.patologiasAll()
      .toPromise()
      .then(result => {
        this.patologias=result;
        this.selectedOptionPatolog= this.patologias.find(p => p.descripcion=='SIN ESPECIFICACION')
      });      
  }

  private llenarArrayAfecciones(){
    this.srvAfeccion.AfeccionesAll()
      .toPromise()
      .then(result => {
        this.afecciones=result;        
      });      
  }

  private llenarArrayRemitidos(){
    this.srvRemitidos.remitidosAll()
      .toPromise()
      .then(result => {
        this.remitidos=result;        
      });      
  }

  private llenarArrayTiempoReposo(){
    this.srvTiempoReposo.tiempoReposoAll()
      .toPromise()
      .then(result => {
        this.tiemposReposo=result;        
      });      
  }

  private llenarArrayMedicos(){

    this.srvMedicos.medicosAll()
      .toPromise()
      .then(result => {
        this.medicos=result;           
      });

      this.srvMedicos.paraMedicosAll()
      .toPromise()
      .then(result => {
        this.paramedicos=result;            
      });

  }

  private llenarArrayMotivos(){

    this.srvMotivo.motivosAll()
      .toPromise()
      .then(result => {
        this.motivos=result;           
      });      
  }

  private llenarArrayAreas(){

    this.srvArea.areasAll()
      .toPromise()
      .then(result => {
        this.areas=result;           
      });      
  }
  
  private buscarPaciente(){
    if (this.paciente.ci!="" &&  this.paciente.ci!= undefined){
      this.srvPacientes.pacienteOne(this.paciente.ci)
      .toPromise()
      .then(result => {
        if (result[0]!= undefined)
          this.paciente=result[0];
        else
          this.paciente={} 
        console.log(this.paciente);           
      })
    }
    
  }  
  
  Search(){
    
    if(this.searchText!== ""){
       let searchValue = this.searchText.toLocaleLowerCase();
      
       this.returnedSearch = this.consultasTodas.filter((lista:IvConsulta) =>{
         return lista.uid.toString().match(searchValue )
         || lista.fecha.toLocaleLowerCase().match(searchValue )
         || lista.ci.toString().match(searchValue )
         || lista.nombre_completo.toLocaleLowerCase().includes(searchValue )
         //|| lista.sexo==searchValue 
         || lista.motivo.toLocaleLowerCase().match(searchValue )
         || lista.paramedico?.toLocaleLowerCase().match(searchValue )
         || lista.cargo.toLocaleLowerCase().match(searchValue )
         || lista.login_atendio.toLocaleLowerCase().match(searchValue );
       });
       this.totalItems = this.returnedSearch.length;
       this.returnedArray = this.returnedSearch.slice(1, this.numPages);       
       this.maxSize = Math.ceil(this.totalItems/this.numPages);
               
    }
    else { 
      this.totalItems = this.consultasTodas.length;
      this.returnedArray = this.consultasTodas;      
      this.returnedArray = this.returnedArray.slice(1, this.numPages);
      this.maxSize = Math.ceil(this.totalItems/this.numPages);     
       
    } 
  }    

  pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    if(this.searchText== "")
      this.returnedArray = this.consultasTodas.slice(this.startItem, this.endItem);
    else
      this.returnedArray = this.returnedSearch.slice(this.startItem, this.endItem);
   
  }

  private sortTable(prop: string) {
    
      if(this.searchText== ""){        
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
      this.sortOrder =  this.sortOrder * (-1);
  }

  private sortData (a: any, b: any, prop: string, type = ""){
    
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

  private showModalRegistrar(){
    this.newConsulta=true;
    this. modalTitle = "Nueva Consulta Medica";
    this.selectMedicos= this.medicos.filter( m => m.activo=true);
    this.selectParamedicos= this.paramedicos.filter( m => m.activo=true);
    this.autorizacion=true;
    this.selectedOptionPatolog= this.patologias.find(p => p.descripcion=='SIN ESPECIFICACION');
    this.consultas={};
  }

  private guardarSignosVit(_fecha: string, _cedula: string){
    let newSignos: IsignosVitales={
      fcard: this.signoVital.fcard,
      pulso: this.signoVital.pulso,
      temper: this.signoVital.temper,
      tart: this.signoVital.tart,
      fresp: this.signoVital.fresp,
      cedula: _cedula,
      fecha: _fecha
    }
    this.srvSignosVitales.registrar(newSignos).toPromise();
    
    let newDatosAntrop: Iantropometria={
      fecha: _fecha,
      cedula: _cedula,
      imc: this.antropometria.imc,
      talla: this.antropometria.talla,
      peso: this.antropometria.peso
    }

    this.srvAntropometria.registrar(newDatosAntrop).toPromise();
    console.log(newDatosAntrop);
  }

  private registrar(){
    if (this.newConsulta) {
      let consultaNew: IvConsulta={};
      let referenciaMedica: string=null;
      for (let i=0; i< this.arrayReferencias.length; i++){
        referenciaMedica = referenciaMedica + ">>" + this.arrayReferencias[i].especialidad.toUpperCase() + ":" + "\n" + this.arrayReferencias[i].informe + "\n";
      }
      
      this.consultas={
        uid: undefined,
        id_paciente: this.paciente.uid_paciente,
        fecha: formatDate(Date.now(), 'yyyy-MM-dd', 'en'),        
        id_patologia: this.selectedOptionPatolog.uid,        
        fecha_registro: formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss', 'en'),
        turno: 2,
        indicaciones_comp: null,
        referencia_medica: referenciaMedica,                 
        autorizacion: this.autorizacion===true ? 'SI':'NO',
        
        id_medico: this.consultas.id_medico,
        id_paramedico: this.consultas.id_paramedico,
        id_motivo: this.consultas.id_motivo,
        id_area: this.consultas.id_area,
        fkafeccion: this.consultas.fkafeccion,
        id_remitido: this.consultas.id_remitido,
        id_reposo: this.consultas.id_reposo,
        condicion: this.consultas.condicion,
        sintomas: this.consultas.sintomas,
        observaciones: this.consultas.observacion_medicamentos,
        resultado_eva: this.consultas.resultado_eva,
        observacion_medicamentos: this.consultas.observacion_medicamentos
        
      };
      
			this.srvConsultas.nuevo(this.consultas)
				//.toPromise()
				.then(results => {
          this.consultas=results;
          if (this.consultas.uid && typeof this.consultas.uid === 'number'){
            this.showSuccess('Atencion Medica Registrada satisfactoriamente', 'success');
            this.limpiarFiltro();
            this.buscarConsulta.uidConsulta=this.consultas.uid.toString();
            this.consultasFilter().then(
            results => { 
                consultaNew=results[0];                
                this.consultasTodas.push(consultaNew);
                this.guardarSignosVit(consultaNew.fecha, consultaNew.ci );
                this.sortOrder =  this.sortOrder * (-1);
                this.sortTable('uid');                
            })
          }
          else{
            this.showSuccess('Error Registrando', 'danger');
          }
        })
				.catch(err => { console.log(err) });			
		}
		else {

			this.srvConsultas.actualizar(this.consultas)
				.toPromise()
				.then(results => {  })
				.catch(err => { console.log(err) });

			this.showSuccess('Atencion Medica actualizada satisfactoriamente', 'success');

		}
		this.consultas = {};
    this.signoVital = {};
    this.antropometria={};
    this.arrayReferencias=[];
		this.newConsulta = false;
    this.primaryModal.hide();
  }

  private addReferencia(){
    
    if (this.referencia.especialidad!="" && this.referencia.especialidad != undefined && this.referencia.informe!="" && this.referencia.informe){
      this.arrayReferencias.push(this.referencia);
      this.alertaReferencia='';
      this.titleReferencia=''
      this.referencia={};
    }
    else{
      this.titleReferencia='Error: Campo Vacio';
      if (this.referencia.especialidad=="" || this.referencia.especialidad == undefined){        
        this.alertaReferencia='Debe llenar El campo Especialidad';
      }
      if (this.referencia.informe=="" || this.referencia.informe == undefined){        
        this.alertaReferencia='Debe llenar El campo Informe';
      }
    }
  }

  private quitReferencia(ind: number){    
    this.arrayReferencias.splice(ind, 1);
  }

  private collapsed(event: any): void {
    // console.log(event);
  }

  private expanded(event: any): void {
    // console.log(event);
  }

  private toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

    this.isCollapsed_1 = !this.isCollapsed_1;
    this.iconCollapse_1 = this.isCollapsed_1 ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  showSuccess(mensaje: string, clase: string): void {
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

  onSelect(event: TypeaheadMatch): void {
    this.selectedOptionPatolog = event.item;
  }
}
