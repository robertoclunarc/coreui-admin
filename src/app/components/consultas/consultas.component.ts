//componentes
import { Component, ViewChild, OnInit } from '@angular/core';
import {ModalDirective} from 'ngx-bootstrap/modal';
import { AlertComponent } from 'ngx-bootstrap/alert';

//servicios
import { ConsultasService } from '../../services/consultas.service';
import { PacientesService } from '../../services/pacientes.service';
import { MedicosService } from '../../services/medicos.service';
import { MotivosService } from '../../services/motivos.service';
import { AreasService } from '../../services/areas.sevice';
//modelos
import { IConsultas, IConsultasConstraint, IvConsulta, IFiltroConsulta } from '../../models/consultas.model';
import { IsignosVitales } from '../../models/signos_vitales.model';
import { Iantropometria  } from '../../models/antropometria.model';
import { IvPaciente } from '../../models/paciente.model';
import { IMedicos, IParamedicos } from '../../models/medicos.model';
import { IMotivo } from '../../models/motivos.model';
import { IAreas } from '../../models/areas.model';

/*
import { DecimalPipe } from '@angular/common';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
*/

@Component({
  templateUrl: 'consultas.component.html',
  providers: [ConsultasService, PacientesService, MedicosService, MotivosService, AreasService],
  
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
  
  private searchText = ""; 
  private modalTitle = "";

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

  private titulos = [
    {
      titulo: 'Nro.',
      campo:'uid'
    },
    {
      titulo: 'Fecha',
      campo:'fecha'
    },
    {
      titulo: 'Cedula',
      campo:'ci'
    },
    {
      titulo: 'Nombre',
      campo:'nombre_completo'
    },
    {
      titulo: 'Sexo',
      campo:'sexo'
    },
    {
      titulo: 'Cargo',
      campo:'cargo'
    },
    {
      titulo: 'Motivo',
      campo:'motivo'
    },
    {
      titulo: 'Paramedico',
      campo:'paramedico'
    },
    {
      titulo: 'Atendido por',
      campo:'login_atendio'
    }];

  selected?: string;
  states: string[] = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Dakota',
    'North Carolina',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
  ];

  constructor(
    private srvConsultas: ConsultasService,
    private srvPacientes: PacientesService,
    private srvMedicos: MedicosService,
    private srvMotivo: MotivosService,
    private srvArea: AreasService,
    ) { }

  ngOnInit(): void {
		this.consultasFilter();
    this.llenarArrayMedicos();
    this.llenarArrayMotivos();
    this.llenarArrayAreas();
	}

  consultasFilter() {
    this.buscarConsulta = { 
      uidConsulta: 'null',
      uidPaciente: 'null',
      uidMotivo: 'null',
      fechaIni: 'null',
      fechaFin: 'null',
      ciMedico:'null',
      ciParamedico: 'null'
    }
		this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()
			.then(results => {				
					
				this.consultasTodas = results;       
        
        this.totalItems = this.consultasTodas.length;
        this.maxSize = Math.ceil(this.totalItems/this.numPages);             
        this.returnedArray = this.consultasTodas.slice(0, this.numPages);
        
        /*console.log('maxsize: ' + this.maxSize);
        console.log('total item: ' + this.totalItems);
        console.log('bigTotalItems: ' + this.bigTotalItems);
        console.log('currentPage: ' + this.currentPage);
        console.log('currentPager: ' + this.currentPager);
        console.log('smallnumPages: ' + this.smallnumPages);*/            
				
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
        this.paciente=result[0];             
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
    console.log(type)
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
  }

  private registrar(){
    if (this.newConsulta) {

			this.srvConsultas.registrar(this.consultas)
				.toPromise()
				.then(results => {  })
				.catch(err => { console.log(err) });

			this.showSuccess('Atencion Medica Registrada satisfactoriamente');
		}
		else {

			this.srvConsultas.actualizar(this.consultas)
				.toPromise()
				.then(results => {  })
				.catch(err => { console.log(err) });

			this.showSuccess('Atencion Medica actualizada satisfactoriamente');

		}
		this.consultas = null;
		this.newConsulta = false;
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

  showSuccess(mensaje: string): void {
    this.alertsDismiss.push({
      type: 'info',
      msg: mensaje,
      //msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }
}