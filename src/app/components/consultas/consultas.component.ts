import { Component, ViewChild, OnInit } from '@angular/core';
import { ConsultasService } from '../../services/consultas.service';
import { IConsultas, IConsultasConstraint, IvConsulta, IFiltroConsulta } from '../../models/consultas.model';

import {ModalDirective} from 'ngx-bootstrap/modal';
/*
import { DecimalPipe } from '@angular/common';
import { CarouselConfig } from 'ngx-bootstrap/carousel';
*/
@Component({
  templateUrl: 'consultas.component.html',
  providers: [ConsultasService]

})
export class ConsultasComponent  implements OnInit  {
  // PolarArea
  private polarAreaChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  private polarAreaChartData: number[] = [300, 500, 100, 40, 120];
  private polarAreaLegend = true;
  private polarAreaChartType = 'polarArea';

  @ViewChild('primaryModal') public primaryModal: ModalDirective;

  private buscarConsulta: IFiltroConsulta;
  private consultasTodas: IvConsulta[];
  private returnedArray: IvConsulta[];
  private returnedSearch: IvConsulta[];
  private consultas: IConsultas[];
  
  private searchText = "";  

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

  constructor(private srvConsultas: ConsultasService) { }

  ngOnInit(): void {
		this.consultasFilter();
   
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
        this.consultas = results;
        
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
  
  Search(){
    
    if(this.searchText!== ""){
       let searchValue = this.searchText.toLocaleLowerCase();
      
       this.returnedSearch = this.consultasTodas.filter((lista:IvConsulta) =>{
         return lista.uid.toString().match(searchValue )
         || lista.fecha.toLocaleLowerCase().match(searchValue )
         || lista.ci.toString().match(searchValue )
         || lista.nombre_completo.toLocaleLowerCase().match(searchValue )
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

  sortTable(prop: string) {
    
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

  sortData (a: any, b: any, prop: string, type = ""){
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
}