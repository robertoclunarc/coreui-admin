import { Component, ViewChild, OnChanges, Inject, LOCALE_ID, Input, Output, EventEmitter,  ChangeDetectionStrategy} from '@angular/core';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective} from 'ngx-bootstrap/modal';
//modelos

import { IFiltroConsulta, IvMorbilidad } from '../../../models/servicio-medico/consultas.model'
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';

//servicios
import { ConsultasService } from '../../../services/servicio_medico/consultas.service';


@Component({
  selector: 'app-historial_consulta',
  templateUrl: './historial_consulta.component.html',
  styleUrls: ['./historial_consulta.component.css'],
  providers: [ 
    { provide: AlertConfig }],
})
export class HistorialConsultasComponent implements OnChanges {

  @Output() itemsConsulta = new EventEmitter<number>();
  @ViewChild('primaryModal') public primaryModal: ModalDirective;  
  @Input() _uidPaciente: string;
  @Input() _ci: string;
  @Input() _fechaIni: string;
  @Input() _fechaFin: string;
  
  constructor(    
    private route: ActivatedRoute,  
    private router: Router,
    private srvConsultas: ConsultasService,     
    @Inject(LOCALE_ID) public locale: string,    
  ) { }

  idConsulta: string;
  uidPaciente: string;
  fechaIni: string;
  fechaFin: string
  sliceIndex: number;  
  private morbilidad: IvMorbilidad[]=[];
  returnedArray: IvMorbilidad[]=[];
  private user: IUsuarios={};
  private tipoUser: string; 
  columnas: string[]=['Cedula','Paciente','Ver', 'Cargo', 'Supervisor', 'Area', 'Fecha','Motivo','Tipo Afeccion','Diagnostico', 'Condicion', 'Medicamento(s)', 'Talla','Peso','IMC', 'Edad', 'Direccion_Hab.','Mano Dominante', 'Sexo','Medico','Paramedico'];
  startItem: number;
  endItem: number;
  alertsDismiss: any = [];
  totalItems: number;//total number of items in all pages
  //currentPage: number   = 1;
  //smallnumPages: number;
  maxSize: number;//limit number for page links in pager
  //bigTotalItems: number = 0;
  //bigCurrentPage: number = 1;
  numPages: number = 10;//se activa cuando cambia el recuento total de páginas, $event:number es igual al recuento total de páginas
  //currentPager: number   = 5;  

  async ngOnChanges() {
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
    
    this.uidPaciente = this.route.snapshot.paramMap.get("idPaciente")==undefined? this._uidPaciente: this.route.snapshot.paramMap.get("idPaciente");
    this.fechaIni = this.route.snapshot.paramMap.get("fechaIni")==undefined? this._fechaIni: this.route.snapshot.paramMap.get("fechaIni");
    this.fechaFin = this.route.snapshot.paramMap.get("fechaFin")==undefined? this._fechaFin: this.route.snapshot.paramMap.get("fechaFin");
    
    if (this.uidPaciente=="null" || this.uidPaciente==undefined) 
      this.sliceIndex=0;
    else
      this.sliceIndex=2;
    
    await this.buscarConsultasPaciente();
  }  
  
  private async buscarConsultasPaciente(){
    
    if (this.uidPaciente!= undefined && this.uidPaciente!= null){
      let filtro: IFiltroConsulta = {fechaIni: this.fechaIni, fechaFin: this.fechaFin, ciPaciente: this._ci}
      await this.srvConsultas.morbilidadFilter(filtro)
      .toPromise()
      .then(async result => {
        
        if (result.length>0){          
          this.morbilidad=result;
          this.totalItems = this.morbilidad.length;
          this.maxSize = Math.ceil(this.totalItems/this.numPages);             
          this.returnedArray = this.morbilidad.slice(0, this.numPages);
          this.itemsConsulta.emit(this.totalItems);                
        }
        else{
          this.morbilidad=[];
        }
      })
    }   
  }

  private irConsulta(uid: string){
    this.idConsulta=uid;
  }

  /*private close(){    
    this.idConsulta
  }*/

  pageChanged(event: any): void {
    this.startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;    
    this.returnedArray = this.morbilidad.slice(this.startItem, this.endItem); 
  }
}