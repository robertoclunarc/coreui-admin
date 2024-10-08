//componentes
import { Component, ViewChild, OnInit,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap/modal';
//import { FormsModule } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

//servicios
import { VarioService } from '../../../services/servicio_medico/varios.service';
import { ConsultasService } from '../../../services/servicio_medico/consultas.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';
import { MedicosService } from '../../../services/servicio_medico/medicos.service';
import { MotivosService } from '../../../services/servicio_medico/motivos.service';
import { AreasService } from '../../../services/servicio_medico/areas.service';
import { PatologiasService } from '../../../services/servicio_medico/patologias.service';
import { AfeccionesService } from '../../../services/servicio_medico/afecciones.service';
import { SignosVitalesService } from '../../../services/servicio_medico/signosvitales.service';
import { RemitidosService } from '../../../services/servicio_medico/remitidos.service';
import { TiempoReposoService } from '../../../services/servicio_medico/tiemporeposos.service';
import { AntropometriaService } from '../../../services/servicio_medico/antropometria.service';
import { MedicamentosService } from '../../../services/servicio_medico/medicamentos.service';
import { HistoriaService } from '../../../services/servicio_medico/historias.service';
import { CorreoService } from "../../../services/servicio_medico/correo.service";
import { DiagnosticosService } from "../../../services/servicio_medico/tipoDiagnostico.service";

//modelos
import { Ipopover } from '../../../models/servicio-medico/varios.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IConsultas, IvConsulta, IFiltroConsulta, Ireferencia, IvMorbilidad, INotaExamen } from '../../../models/servicio-medico/consultas.model';
import { IsignosVitales } from '../../../models/servicio-medico/signos_vitales.model';
import { Iantropometria  } from '../../../models/servicio-medico/antropometria.model';
import { IvPaciente } from '../../../models/servicio-medico/paciente.model';
import { IMedicos, IParamedicos } from '../../../models/servicio-medico/medicos.model';
import { IMotivo } from '../../../models/servicio-medico/motivos.model';
import { IAreas } from '../../../models/servicio-medico/areas.model';
import { IPatologia } from '../../../models/servicio-medico/patologias.model';
import { IAfecciones } from '../../../models/servicio-medico/afecciones.model';
import { IRemitido } from '../../../models/servicio-medico/remitidos.model';
import { ITiempoReposo } from '../../../models/servicio-medico/tiemporeposos.model';
import { IMedicamento, IMedicamentosAplicados, ImedicamentosConsulta, IMedicinasAplicadas } from '../../../models/servicio-medico/medicamentos.model';
import { IindicacionMedica } from '../../../models/servicio-medico/recetamedica.models';
import { IHistoria_medica, IHistoria_paciente } from '../../../models/servicio-medico/historias.model';
import { ImailOptions } from "../../../models/servicio-medico/correo.model";
import { ItipoDiagnostico } from "../../../models/servicio-medico/tipoDiagnostico.model";

import { environment } from "../../../../environments/environment";
import { ISolicitudAtencion } from '../../../models/servicio-medico/solicitudatencion.model';
import { SolicitudAtencionService } from '../../../services/servicio_medico/solicitudatencion.service';

@Component({
  selector: 'app-consultas',
  templateUrl: 'consultas.component.html',
  providers: [ConsultasService, PacientesService, MedicosService, MotivosService, AreasService, PatologiasService, 
              AfeccionesService, SignosVitalesService, RemitidosService, TiempoReposoService, AntropometriaService,
              MedicosService,HistoriaService, DiagnosticosService,
              { provide: AlertConfig },
            ],
  styleUrls: ["consultas.component.css"],
             
})
export class ConsultasComponent  implements OnInit  {  
  @ViewChild('myModalPlanilla') public myModalPlanilla: ModalDirective;
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  //@ViewChild('txtPatologia', { static: false }) txtPatologia: ElementRef<HTMLInputElement>;
  //@ViewChild(TypeaheadDirective, { static: false }) typeaheadInstance: TypeaheadDirective;
  //@ViewChild('typeaheadInstance', { static: false }) typeaheadInstance: ElementRef<HTMLInputElement>;
  @ViewChild('typeaheadInstance') typeaheadInstance;

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';
  isCollapsed_1: boolean = true;
  iconCollapse_1: string = 'icon-arrow-down';
  private searchTimeout: any;
  user: IUsuarios={};
  tipoUser: string;
  uidPaciente: string;
  buscarConsulta: IFiltroConsulta;
  consultasTodas: IvConsulta[];
  consultasAnteriores: IvConsulta[];
  returnedArray: IvConsulta[];
  returnedSearch: IvConsulta[];
  typeaheadWaitMilliseconds: number = 500;
  showSuggestions = true;
  consultas: IConsultas={};
  vConsultas: IvConsulta={};
  signoVital: IsignosVitales={};
  antropometria: Iantropometria={};
  paciente: IvPaciente={};
  newConsulta: boolean=false;
  alertsDismiss: any = [];
  medicos: IMedicos[]=[];
  paramedicos: IParamedicos[]=[];
  selectMedicos: IMedicos[]=[];
  selectParamedicos: IParamedicos[]=[];
  private motivos: IMotivo[]=[];
  arrayMotivos: IMotivo[]=[];
  areas: IAreas[]=[];
  selectedPatolog: string = ' ';
  patologias: IPatologia[] = [];
  patologiasAll: IPatologia[] = [];
  _patologias: IPatologia[] = [];
  afecciones: IAfecciones[]=[];
  selectedOptionPatolog: any;  
  searchText = "";
  modalTitle = "";
  autorizacion: boolean = false;
  remitidos: IRemitido[]=[];
  tiemposReposo: ITiempoReposo[]=[];
  referencia: Ireferencia={};
  arrayReferencias: Ireferencia[]=[];
  alertaRegistrar: string=""; 
  titleRegistrar: string="";
  popoverConsulta: Ipopover={}
  alertaReferencia: string=""; 
  titleReferencia: string="";
  alertaMedicamento: string=""; 
  titleMedicamento: string="";
  alertaIndicacion: string=""; 
  titleIndicacion: string="";
  arrayMedicamentos: IMedicamento[]=[];
  medicamentoAplicado: ImedicamentosConsulta ={};
  medicamentoAplic: IMedicamentosAplicados={};
  arrayMedicamentosIndicados: IMedicamento[]=[];
  medicamentoIndicados: IindicacionMedica[]=[];
  medicamentoIndic: IindicacionMedica={};
  solicitud: ISolicitudAtencion={};
  turno: number;
  observacionesArray: {user?: string, observacion?:string, fecha?: string}[]=[];
  observacion: string = '';
  idSolicitud: number;
  historiaMedica: IHistoria_medica={};
  arrayTiposDiagnoticos: ItipoDiagnostico[]=[];
  loadingPatologia: boolean = false;
  queryPatologia: string[]=[];
  blockRegister: boolean = false;
  fechaSalida: string;
  soloLectura: boolean;
  urlICD: string;
  public classTable: string;
  public classButton: string;
  public estiloOscuro: string;
  public titleButtonSend: string = 'Enviar';
  public titleButtonExport: string = 'Exportar';
  public preEmpleo: boolean = false;
  show = false;
  planilla: string;
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
    {titulo: 'Nro.', campo:'uid'}, {titulo: 'Fecha', campo:'fecha'}, {titulo: 'Cédula', campo:'ci'}, {titulo: 'Nombre', campo:'nombre_completo'},
    {titulo: 'Sexo', campo:'sexo'},{titulo: 'Cargo', campo:'cargo'}, {titulo: 'Motivo', campo:'motivo'}, {titulo: 'Enfermera(o)', campo:'paramedico'}, 
    {titulo: 'Asistenciado', campo:'login_atendio'}, {titulo: 'Patología', campo:'patologia'}
  ];

  condiciones =[
    {valor:'N/A', display:'No Aplica'}, {valor: 'APTO', display:'APTO'},
    {valor:'NO APTO', display:'NO APTO'}, {valor:'APTO RESTR', display:'APTO CON RESTRICCION'}
  ];

  // PolarArea
  polarAreaChartLabels: string[];
  polarAreaChartData: number[];
  polarAreaLegend= true;
  polarAreaChartType = 'polarArea';  

  constructor(
    private route: ActivatedRoute,
    private router: Router,    
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
    private srvMedicamentos: MedicamentosService,
    private srvHistorias: HistoriaService,
    private srvCorreo: CorreoService,
    private srvTipoDiagnosticos: DiagnosticosService,
    private srvVarios: VarioService,
    private srvSolicitud: SolicitudAtencionService,
    @Inject(LOCALE_ID) public locale: string,  
  ) { this.urlICD = environment.urlICD; }

  async ngOnInit() {    
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
    
    this.llenarArrayTiposDiagnosticos();
    this.llenarArrayConsultasMotivos();
		
    await this.llenarArrayMotivos();
    this.llenarArrayAreas();
    
    this.patologiasAll = await  this.llenarArrayPatologias(undefined,undefined,undefined,undefined, undefined, undefined)

    this.llenarArrayAfecciones();
    this.llenarArrayRemitidos();
    this.llenarArrayTiempoReposo();
    this.llenarArraymedicamentos('EXISTECIA');

    if (this.route.snapshot.paramMap.get("idsolicitud")!==undefined && this.route.snapshot.paramMap.get("idsolicitud")!==null){
      const getParam = this.route.snapshot.paramMap.get("idsolicitud");
      if (getParam.includes('-')){
         const idConsulta = getParam.split('-')[0];
         this.abrirConsultaOne(idConsulta);
      }else{
        this.idSolicitud = Number(getParam);
      }
    }
    
    //this.idSolicitud = this.route.snapshot.paramMap.get("idsolicitud")!==undefined ? Number(this.route.snapshot.paramMap.get("idsolicitud")): undefined;
    
    if (this.idSolicitud){
      this.traerDatosSolicitud();
    }
    this.llenarArrayConsultas(true);
	}

  async abrirConsultaOne(idConsulta: string) {
    try {
      this.limpiarFiltro();
      this.buscarConsulta.uidConsulta = idConsulta;
      const consultaOne: any = await this.consultasFilter();
      this.searchText = idConsulta;
      this.Search();
      await this.showModalActualizar(consultaOne[0]);
      this.primaryModal.show();
    } catch (error) {
      console.error(error);
    }
  }

  async traerDatosSolicitud(){
    try {
      this.solicitud = await this.srvSolicitud.solicitudOne(this.idSolicitud).toPromise();
      
      this.primaryModal.show();
      await this.showModalRegistrar();
      this.paciente.ci = this.solicitud.ci_paciente;
      this.buscarPaciente();
      this.consultas.sintomas = this.solicitud.motivo;
      let fecha = new Date();
      this.fechaSalida = formatDate(fecha.setMinutes(fecha.getMinutes()+15), 'yyyy-MM-dd HH:mm', this.locale);
      this.solicitud.fecha_salida = this.fechaSalida;
      
      if (this.solicitud.id_consulta){
        const ultimaAtencion: IConsultas = await this.srvConsultas.consultasOne(this.solicitud.id_consulta).toPromise();
        this.vConsultas.fkdiagnostico = this.motivos.find((m) => {return m.uid == ultimaAtencion.id_motivo}).fkdiagnostico
        await this.listarMotivos(this.vConsultas.fkdiagnostico);
        this.consultas.id_patologia = ultimaAtencion.id_patologia;
        this.consultas.id_area = ultimaAtencion.id_area;
        this.consultas.id_motivo = ultimaAtencion.id_motivo;
        this.consultas.fkafeccion = ultimaAtencion.fkafeccion;
      }
      
    } catch (error) {
      console.error(error);
    }
  }

  public downloadAsPDF(uid: number) {
    
    //this.router.navigate([`serviciomedico/atenciones/planillaconsulta/${uid}`]);
    this.uidPaciente=uid.toString();
  }

  private async limpiarFiltro(){
      this.buscarConsulta = {
      uidConsulta: 'null',
      ciPaciente: 'null',
      Motivo: 'null',
      uidMotivo: 'null',
      fechaIni: 'null',
      fechaFin: 'null',
      Medico: this.tipoUser==='PARAMEDICO' ? this.user.login  : 'null',
      Paramedico: 'null',
      nombrePaciente: 'null',
      cargo: 'null',
      fecha: 'null',
      condlogica: 'null',
      patologia: 'null',
    }
  }
   
  private async consultasFilter() {
    
		return await this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()
			.catch(err => { console.error(err) });
	}
  
  async llenarArrayConsultas(conFechaActual?: boolean) {
    this.searchText = conFechaActual ? formatDate(Date.now(), 'yyyy-MM-dd', this.locale) : "";
    this.limpiarFiltro();
    this.buscarConsulta.fecha = conFechaActual ? this.searchText : 'null';
		this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()
			.then(results => {
				this.consultasTodas = results;
        this.totalItems = this.consultasTodas.length;
        this.maxSize = Math.ceil(this.totalItems/this.numPages);
        this.returnedArray = this.consultasTodas.slice(0, this.numPages);				
			})
			.catch(err => { console.error(err) });
	}
  
  private async llenarArrayConsultasMotivos() {
    this.polarAreaChartLabels=['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25'];
    this.polarAreaChartData=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25];
    let desc: string[]=[];
    let cant: number[]=[];
		this.srvConsultas.consultasPorMotivos()
			.toPromise()
			.then(async results => {        
				//this.arrayConnsultaMotivos = results;
        for await (let mot of results){
          desc.push(mot.descripcion);
          cant.push(mot.totalmotivos);
        }	
        this.polarAreaChartLabels=desc;
        this.polarAreaChartData=cant;
			})
			.catch(err => { console.error(err) });
	} 
  // events
  chartClicked(e: any): void {
    console.log(e);
  }

  chartHovered(e: any): void {
    console.log(e);
  }

  private async llenarArrayPatologias(uid: number, descripcion: string, codigo: string, estatus: boolean, tipo: string, view: number){
    let _pat: IPatologia[]=[];
    await this.srvPatologia.consultaFilter(uid,descripcion,codigo,estatus, tipo, view)
      .toPromise()
      .then(async result => {
        _pat = await Promise.all(result.map((res) => ({
          
          descripcion: res.codigo_etica!==null ? res.codigo_etica + ': ' + res.descripcion : res.descripcion,
          tipo: res.tipo,
          codigo_etica: res.codigo_etica,
          url: res.url,
          estatus: true,
          view: res.view,
          uid: res.uid,
          definicion: res.definicion
        })));
      });
    this.srvPatologia.consultaFilter(undefined,'SIN ESPECIFICACION',undefined,true, 'NINGUNA', undefined)
    .toPromise()
    .then(result => {
      _pat.push(result[0]);
      /*this.selectedPatolog = result[0].descripcion;
      this.selectedOptionPatolog = result[0];*/
    });   
    return _pat;
  }

  private llenarArrayTiposDiagnosticos(){
    this.srvTipoDiagnosticos.tiposDiagnosticosAll()
      .toPromise()
      .then(result => {
        this.arrayTiposDiagnoticos=result;        
      });      
  }

  private llenarArraymedicamentos(existencia: string){
    this.srvMedicamentos.medicamentosAll()
      .toPromise()
      .then( result => {
        if (existencia==='TODO')
          this.arrayMedicamentos=result;
        else{
          this.arrayMedicamentos=result.filter(m => ( m.activo===true || m.existencia>0) && m.tipo==="MEDICINA");          
         }
         this.arrayMedicamentosIndicados=result; 
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

  private async llenarArrayMedicos(){
    this.medicos=[];
    this.paramedicos=[];
      
    await this.srvMedicos.medicosAll()
      .toPromise()
      .then(result => {
        if (this.tipoUser=='MEDICO'){
          this.medicos=result.filter(m => (m.login==this.user.login))
        }else{
          this.medicos=result;
          //this.medicos.unshift({ uid: null, nombre: 'Sleccione Medico', activo: true });
          //console.log(this.medicos);
        }           
      });
   

    await this.srvMedicos.paraMedicosAll()
    .toPromise()
    .then(result => {
      if (this.tipoUser=='PARAMEDICO'){
        this.paramedicos=result.filter(p => (p.login==this.user.login))
      }else{
        this.paramedicos=result;
      }            
    });
  }

  private async llenarArrayMedicosALL(){
    this.medicos=[];
    this.paramedicos=[];
    await this.srvMedicos.medicosAll()
      .toPromise()
      .then(result => {
        this.medicos=result;
        //this.medicos.unshift({ uid: null, nombre: 'Sleccione Medico' })
      });

    await  this.srvMedicos.paraMedicosAll()
      .toPromise()
      .then(result => {
        this.paramedicos=result;
      });
  }

  private async llenarArrayMotivos(){

    await this.srvMotivo.motivosAll()
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
  
  buscarPaciente(){
    try {    
      if (this.paciente.ci!="" &&  this.paciente.ci!= undefined){
        this.srvPacientes.pacienteOne(this.paciente.ci)
        .toPromise()
        .then(result => {
          if (result[0]!= undefined){
            this.paciente=result[0];
            this.buscarHistoriaPaciente(this.paciente.uid_paciente);
          }
          else{ this.paciente={} }            
        })
      }
    } catch (error) {
      console.error('buscarPaciente: '+error);
    }
  }

  async buscarHistoriaPaciente(idpaciente: number){
    try {
      if ( idpaciente!= undefined){
        await this.srvHistorias.historiaMedicaOne('null', idpaciente.toString())
        .toPromise()
        .then((result) => {
          this.historiaMedica=result;
        });
      }
    } catch (error) {
      console.error('buscarHistoriaPaciente: '+error);
    }
  }

  buscarMedicamentosAplicados(idConsulta: number){
    if ( idConsulta!= undefined){
      this.srvMedicamentos.medicamentosAplicados(idConsulta)
      .toPromise()
      .then(result => {
        if (result!= undefined){           
           this.medicamentoAplicado=result;           
        }
        else
        this.medicamentoAplicado={}
        
      })
    }    
  }
  
  async buscarSignosVitales(ci: string, fecha: string){
    if (ci!="" &&  ci!= undefined){
      console.log(fecha);
      console.log(formatDate(fecha, 'yyyy-MM-dd HH:mm', this.locale));
      console.log( this.locale);
      try {       
        await this.srvSignosVitales.signosVitalesOne(ci, fecha)
        .toPromise()
        .then(result => {
          if (result[0]!= undefined)
            this.signoVital=result[0];
          else
            this.signoVital={} 
          
        });
        await this.srvAntropometria.antropometriaOne(ci, fecha)
        .toPromise()
        .then(result => {
          if (result[0]!= undefined)
            this.antropometria=result[0];
          else
            this.antropometria={} 
          
        });
      } catch (error) {
        console.error(error)
      }
    }    
  }

  private stringContainsNumber(_input: string, search: string, field: string){
    let string1 = _input.split('');
    //if (field==='uid')
    //  console.log(string1);
    let string2: string='';
    /*let length: number=0;

    if (field==='fecha')
      length=10;
    else  
      if (field==='uid' || field==='ci')
        length=string1.length-1;*/
    
      for( let i = 0; i < search.length; i++){
        string2 += string1[i];
        
        if(search==string2) {         
          if (field==='uid')
          console.log(`[${string1[i]}](${search.length})${_input}:${string2}==${search}`) 
          return true;
        }
      }
      return false;
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
      
      this.buscarConsulta = { 
        uidConsulta: fecha==='null' ? searchValue : 'null',
        ciPaciente: fecha==='null' ? searchValue : 'null',
        Motivo: fecha==='null' ? searchValue : 'null',
        uidMotivo: fecha==='null' ? searchValue : 'null',
        fechaIni: fecha,
        fechaFin: fecha,
        Medico: this.tipoUser==='PARAMEDICO' ? this.user.login : 'null',
        Paramedico: fecha==='null' ? searchValue : 'null',
        nombrePaciente: fecha==='null' ? searchValue : 'null',
        cargo: fecha==='null' ? searchValue : 'null',
        fecha: 'null',
        condlogica: 'OR',
        patologia: this.tipoUser==='PARAMEDICO' ? 'null' : searchValue,
      } 
      this.returnedSearch=[];
      this.srvConsultas.searchConsultaPromise(this.buscarConsulta)
      .then(async (res) => {
            
            this.returnedSearch= res;            
            this.totalItems = this.returnedSearch.length;
            this.returnedArray = this.returnedSearch.slice(0, this.numPages);
            this.maxSize = Math.ceil(this.totalItems/this.numPages);
          });
    }
    else {
      this.totalItems = this.consultasTodas.length;      
      this.returnedArray = this.consultasTodas.slice(0, this.numPages);
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
    
      if(this.searchText == "" || this.returnedSearch===undefined){        
        if (this.sortOrder==1)
          this.returnedArray = this.consultasTodas.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(0, this.numPages);
        else
          this.returnedArray = this.consultasTodas.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(0, this.numPages);        
      }
      else{
        if (this.sortOrder==1){
          this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(a, b, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);
        }
        else{          
          this.returnedArray = this.returnedSearch.sort(((a , b) => {  return this.sortData(b, a, prop, typeof a[prop]) } )).slice(this.startItem, this.endItem);
        } 
          
          /*this.returnedArray = this.returnedSearch
          .filter(item => item && item[prop] !== undefined && item[prop] !== null)
          .sort((a, b) => this.sortData(b, a, prop, typeof a[prop]))
          .slice(this.startItem, this.endItem);*/        
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

  private verTurno(){
    let tiempo = formatDate(Date.now(), 'HH:mm:ss', this.locale);
    let array = tiempo.split(':');
    let hora = Number(array[0]);

    if (hora >= 23 || hora < 7) {
      this.turno = 1; // Turno 1: Desde las 23:00 hasta las 6:59
    } else if (hora >= 7 && hora < 15) {
      this.turno = 2; // Turno 2: Desde las 7:00 hasta las 14:59
    } else if (hora >= 15 && hora < 23) {
      this.turno = 3; // Turno 3: Desde las 15:00 hasta las 22:59
    }
  }

  chequeaAutorizacionMotivo(idMotivo: number){
    if (idMotivo==9){//9=pre empleo
      this.preEmpleo=true;
      this.autorizacion=true;
    }else{
      this.preEmpleo=false;
      this.autorizacion=false
    }
    console.log(idMotivo, this.consultas.id_motivo)
  }

  async listarMotivos(idDiagnostico: number){
    this.arrayMotivos = [];
    for await (const m of this.motivos) {
      if (m.fkdiagnostico == idDiagnostico && m.activo) {        
        this.arrayMotivos.push(m);
      }
    }
    this.consultas.id_motivo = this.arrayMotivos[0]?.uid;
  }

  private convReferenciaInArray(referencia: string){
    if (referencia!=undefined){
      let array = referencia.split('>>');
      let rfcia: string[];
      let Irefcia: Ireferencia;      
      array.shift();//elimina el 1er elemento ya que esta siempre vacio
      for (let i = 0; i<array.length; i++) {
        rfcia=[];        
        rfcia = array[i].split(':');
        Irefcia={
          especialidad: rfcia[0].trim(),
          informe: rfcia[1].trim().replace(/\n/g, ''),
        }        
        this.arrayReferencias.push(Irefcia);
        //console.log(this.arrayReferencias)
      }
    }    
  }

  private convIndicacionesInArray(indicaciones: string){
    if (indicaciones!=undefined){
      let array = indicaciones.split('\n');
      let indica: string[];      
      let indicacion: IindicacionMedica;
      array.pop();//elimina el ultimo elemento  ya que esta siempre vacio
      for (let i = 0; i<array.length; i++) {
        indica = array[i].split(':');        
        indicacion={
          medicamento: indica[0].trim(),
          indicacion: indica[1].trim(),
        }                
        this.medicamentoIndicados.push(indicacion);
        //console.log(this.medicamentoIndicados);
      }
    }    
  }

  async showModalRegistrar(){
    this.soloLectura=false;
    this.autorizacion=false;
    this.observacion = "";
    this.observacionesArray = [];
    this.verTurno();
    this.fechaSalida="";
    this.newConsulta=true;
    this.modalTitle = "Nueva Consulta Medica";
    if (this.tipoUser=='SISTEMA' || this.tipoUser=='MEDICO'){
      this.patologias= await this.llenarArrayPatologias(undefined,undefined,undefined,true, 'ICD', 1);
    }
    else{
      this.patologias= await this.llenarArrayPatologias(undefined,undefined,undefined,true, 'DOMINIO', 2);
    }
    await this.llenarArrayMedicos();
    this.selectMedicos= this.medicos.filter( (m) => {return m.activo==true});
        
    this.selectParamedicos= this.paramedicos.filter( (m) => {return m.activo===true});
    this.selectedOptionPatolog= this.patologias.find((p) => {return p.descripcion=='SIN ESPECIFICACION'});
    this.selectedPatolog ='SIN ESPECIFICACION';
    
    this.paciente={};
    this.consultas={};
    if (this.tipoUser=='PARAMEDICO'){
      const i = await this.srvVarios.searchArrayObject(this.paramedicos, this.user.login, 'login' );      
      this.consultas.id_paramedico=this.paramedicos[i].uid;
      this.consultas.id_medico = this.selectMedicos.find( m => { return m.titular===true}).uid;
    }
    if (this.tipoUser=='MEDICO'){
      this.consultas.id_medico=this.medicos.find(m => (m.login==this.user.login)).uid;
    }
    
    //this.llenarArraymedicamentos('EXISTECIA');
    this.medicamentoAplicado={};
    this.medicamentoAplicado.medicamentos=[];

    let fecha = new Date();
    const fechaObjeto = formatDate(fecha.setMinutes(fecha.getMinutes()+1), 'yyyy-MM-dd HH:mm', this.locale);
    this.consultas.fecha = fechaObjeto;

    /*const hoy = formatDate(Date.now(), 'yyyy-MM-dd HH:mm', this.locale);
    const fechaObjeto = new Date(hoy);
    this.consultas.fecha= fechaObjeto.toISOString().slice(0, 16);*/
    this.consultas.turno=this.turno;
    this.signoVital={};
    this.antropometria={};    
  }
  
  async formatearCampo(cadena: string, user: string, fecha: string){
    if (cadena){
      const index = cadena.indexOf("<br>");
      let observ: {user?: string, observacion?:string, fecha?: string}[]=[];
      if(index===-1){
        observ.push({
          user: user,
          observacion: cadena,
          fecha: fecha,
        });
        this.observacion = `${user}\n${cadena}\n${fecha}<br>`;
      }else{
        let arr = cadena.split('<br>');
        for await (const ob of arr){
          if (ob){
            let res = ob.split('\n');
            if (res[1]!=undefined && res[1]!=''){
              observ.push({
                user: res[0],
                observacion: res[1],
                fecha: res[2],
              });
              this.observacion += `${res[0]}\n${res[1]}\n${res[2]}<br>`;
            }
          }
        }
      }
      this.observacionesArray = observ;
    }   
  }

  async  showModalActualizar(item: IvConsulta){
    this.observacion = "";
    this.observacionesArray = [];
    this.soloLectura=true;
    if (this.tipoUser=='SISTEMA' || this.tipoUser=='MEDICO'){
      this. soloLectura=false;
      this.blockRegister=false;
    }else{
      this.blockRegister=true;
    }
    this.signoVital = {};
    this.antropometria={};
    this.medicamentoAplicado={};
    this.arrayReferencias=[];
    this.medicamentoIndicados=[];
    this.selectParamedicos= [];
    this.selectMedicos= [];
    await this.llenarArrayMedicosALL();
    this.selectParamedicos= this.paramedicos;
    this.selectMedicos= this.medicos;
    this.turno=item.turno;
    await this.listarMotivos(item.fkdiagnostico);
    this.consultas={};
    this.paciente={};
    this.srvSolicitud.atencionOne(item.uid)
    .toPromise()
    .then((res)=>{
      if (res?.fecha_salida !== undefined && res?.fecha_salida !== null){
        const fechaSalidaSolicitud = new Date(res.fecha_salida);
        this.fechaSalida = fechaSalidaSolicitud.toISOString().slice(0, 16);
      }
    });
    const fechaObjeto = new Date(item.fecha_prox_cita);
    const fechaProxCita = item.fecha_prox_cita ? fechaObjeto.toISOString().slice(0, 16) : null;
    const fechaConsulta = new Date(item.fecha);
    const fechaAtencion = item.fecha.slice(0, 16);
    this.consultas = {
      fecha: fechaAtencion,
      uid: item.uid,
      id_motivo: item.idmotivo,
      id_area: item.id_area,
      fkafeccion: item.fkafeccion,
      id_paramedico: item.id_paramedico,
      condicion: item.condicion==='APTO CON RESTRICCION'? 'APTO RESTR': item.condicion,
      fecha_prox_cita: fechaProxCita,
      sintomas: item.sintomas,
      observaciones: item.observaciones,
      resultado_eva: item.resultado_eva,
      //observacion_medicamentos: item.observacion_medicamentos,
      autorizacion: item.autorizacion,
      turno: item.turno,
    }
    if (this.consultas.id_motivo===9){
      this.preEmpleo=true;
    }
    
    this.vConsultas = item; 

    for await (let m of this.selectMedicos){
      if (m.ci==item.ci_medico){
        this.consultas.id_medico = m.uid;
        break;
      }
    }

    for await (let r of this.remitidos){
      if (r.descripcion==item.remitido){
        this.consultas.id_remitido = r.uid;
        break;
      }
    }

    for await (let p of this.tiemposReposo){
      if (p.descripcion==item.reposo){
        this.consultas.id_reposo = p.uid;
        break;
      }
    }

    if (this.tipoUser=='SISTEMA' || this.tipoUser=='MEDICO'){
      this.patologias = await this.llenarArrayPatologias(undefined,undefined,undefined,true, 'ICD', 1);
    }
    else{
      this.patologias = await this.llenarArrayPatologias(undefined,undefined,undefined,true, 'DOMINIO', 2);
    }
    
    for await (let pt of this.patologiasAll){
      if (pt.uid==item.id_patologia){
        this.selectedOptionPatolog= pt;
        this.selectedPatolog=pt.descripcion;
        break;
      }
    }
    
    this.signoVital = {
      fresp: item.fresp,
      pulso: item.pulso,
      temper: item.temper,
      tart: item.tart,
      fcard: item.fcard,
      fecha: item.fecha,
      cedula: item.ci
    };
    this.antropometria = {
      talla: item.talla,
      peso: item.peso,
      imc: item.imc,
      fecha: item.fecha,
      cedula: item.ci,
    }
    //console.log(`buscarSignosVitales(${item.ci},${item.fecha})`);
    //this.buscarSignosVitales(item.ci, item.fecha);    
    this.convReferenciaInArray(item.referencia_medica);
    this.buscarMedicamentosAplicados(item.uid);
    this.convIndicacionesInArray(item.indicaciones_comp);

    if (item.autorizacion=='NO')
      this.autorizacion=false;
    else
      this.autorizacion=true;
    
    this.paciente.ci=item.ci;
    this.paciente.nombre_completo= item.nombre_completo;
    this.buscarPaciente();
    this.newConsulta=false;
    this.modalTitle = "Detalles de la Consulta Nro."+item.uid;

    const atendio: string = item.userRegister ? item.userRegister : item.login_atendio;
    const fAtendio: string = item.fechaModificacion ? item.fechaModificacion : formatDate(item.fecha, 'yyyy-MM-dd hh:mm', this.locale);
    
    await this.formatearCampo(item.observacion_medicamentos, atendio, fAtendio);
    
  } 

  async guardarSignosVit(_fecha: string, _cedula: string){
    if (_fecha!=undefined && _cedula!=undefined){
      try {      
          this.signoVital.cedula=_cedula;
          this.signoVital.fecha=_fecha;
          await this.srvSignosVitales.registrar(this.signoVital).toPromise();
             
          this.antropometria.fecha=_fecha;
          this.antropometria.cedula=_cedula
          await this.srvAntropometria.registrar(this.antropometria).toPromise();
      } catch (error) {
        this.showSuccess('Error Registrando Signos vitales: '+error, 'danger');
      }
    }
  }

  calc_imc(){    
        let talla = Number(this.antropometria.talla);
        let peso = Number(this.antropometria.peso)
        this.antropometria.imc= this.srvAntropometria.calculoImc(talla, peso);        
  }

  async guardarMedicametosAplicados(){
    let medAplic: IMedicamentosAplicados;
    const idConsul: number = this.medicamentoAplicado.id_consulta;
    try {
      for (const med of this.medicamentoAplicado.medicamentos){
        medAplic={
          uid: null,
          id_consulta: idConsul,
          id_medicamento: med.medicamento.uid,
          cantidad: med.cantidad,
          medidas: med.medidas
        };        
        await this.srvMedicamentos.registrarMedicamentosAplicados(medAplic).toPromise();        
      } 
    } catch (error) {
      this.showSuccess('Error Registrando medicamentos aplicados: '+error, 'danger');
    }   
  }

  private async validaEntradas(idPaciente: number, fechaCons: string){
    let consultasDia: any;
    const motivosRepetidos=[7, 8, 9, 10, 13];    
    let popOver: Ipopover={};

    if (idPaciente == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "No ha Seccionado el Paciente"
      };      
      return  popOver;
    }

    if (this.consultas.turno == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "No hay Turno especificado"
      };      
      return  popOver;
    }

    if (this.consultas.id_motivo == undefined || this.consultas.id_motivo.toString()==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe Seleccionar un Motivo"
      };      
      return  popOver;
    }

    if (this.consultas.id_area == undefined || this.consultas.id_area.toString()==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe Seleccionar un Area de Incidencia"
      };      
      return  popOver;
    }    
    
    if ((this.selectedPatolog.trim() !== "") && (this.selectedOptionPatolog?.descripcion.trim()==="" || this.selectedOptionPatolog?.descripcion===undefined)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Seleccione una Patología Válida del Sistema"
      };      
      return  popOver;
    }

    if ((this.tipoUser==='MEDICO') && (this.consultas.condicion == undefined || this.consultas.condicion=="N/A") && (this.consultas.id_motivo==8 || this.consultas.id_motivo==7)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Seleccione la Condicion del Paciente"
      };      
      return  popOver;
    }

    this.buscarConsulta = { 
      uidConsulta: 'null',
      ciPaciente:  this.paciente.ci,
      Motivo: 'null',
      fechaIni: fechaCons,
      fechaFin: fechaCons,
      Medico: this.tipoUser==='PARAMEDICO' ? this.user.login  : 'null',
      Paramedico: 'null',
      nombrePaciente: 'null',
      cargo: 'null',
      uidMotivo: 'null',
      fecha: 'null',
      condlogica: 'AND',
      patologia: 'null',
    }   
    
    for await  (let mot of motivosRepetidos){
      this.buscarConsulta.uidMotivo=mot.toString();
      consultasDia = await this.consultasFilter();      
      if (consultasDia.length>0){            
        popOver= {
          titulo:"Error en el Registro",
          alerta: "El paciente ya tiene una consulta para la  misma fecha y motivo. Nro :" + consultasDia[0].uid
        };
        //console.log(popOver);
        return  popOver;            
      }
      
    }
    
    return popOver;    
  }

  async formatearObersevacion(fechaRegistro: string){
    let observacionNueva: string = '';
    let observacionAnterior: string = '';
    let observacionGlobal: string;
    const obsMedicValido: boolean = await this.srvVarios.nonEmptyValue(this.consultas.observacion_medicamentos);
    if (obsMedicValido){
      observacionNueva = `${this.user.login}\n${this.consultas.observacion_medicamentos}\n${fechaRegistro}<br>`;
    }
    const obsValido: boolean = await this.srvVarios.nonEmptyValue(this.observacion);
    if (!obsValido){
      observacionAnterior = this.observacion;
    }
    
    observacionGlobal = observacionNueva + observacionAnterior;
    return observacionGlobal;
  }

  async registrar(){
    this.blockRegister=true;
    this.popoverConsulta={};
    const fechaRegistro: string = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
    const fechaConsulta: string = this.consultas.fecha;
    let observacion: string = await this.formatearObersevacion(fechaRegistro);
    
    try {
      if (this.newConsulta) {      
        let referenciaMedica: string="";
        for (let i=0; i< this.arrayReferencias.length; i++){
          referenciaMedica = referenciaMedica + ">>" + this.arrayReferencias[i].especialidad.toUpperCase().trim() + ":" + "\n" + this.arrayReferencias[i].informe.trim() + "\n";
        }
        let indicaciones: string="";
        for (let j=0; j< this.medicamentoIndicados.length; j++){
          indicaciones = indicaciones + decodeURI(this.medicamentoIndicados[j].medicamento)  + ": " + this.medicamentoIndicados[j].indicacion + "\n";
  
        }     
        this.consultas={
          uid: undefined,
          id_paciente: this.paciente.uid_paciente,
          fecha: this.consultas.fecha,
          id_patologia: this.selectedOptionPatolog.uid,
          fecha_registro: fechaRegistro,
          turno: this.turno,
          indicaciones_comp: indicaciones,
          referencia_medica: referenciaMedica,
          autorizacion: this.autorizacion===true ? 'SI':'NO',
          id_medico: this.consultas.id_medico,
          id_paramedico: this.consultas.id_paramedico,
          id_motivo: this.consultas.id_motivo,
          id_area: this.consultas.id_area,
          fkafeccion: this.consultas.fkafeccion,
          id_remitido: this.consultas.id_remitido,
          id_reposo: this.consultas.id_reposo,
          condicion: this.consultas.condicion==='APTO CON RESTRICCION'? 'APTO RESTR': this.consultas.condicion,
          sintomas: this.consultas.sintomas,
          observaciones: this.consultas.observaciones,
          resultado_eva: this.consultas.resultado_eva,
          observacion_medicamentos: observacion,
          fecha_prox_cita: this.consultas.fecha_prox_cita,
          userRegister: this.user.login,
        };
        
        this.popoverConsulta = await this.validaEntradas(this.consultas.id_paciente, fechaRegistro);
        
        if ( this.popoverConsulta.alerta!=undefined){
          this.alertaRegistrar = this.popoverConsulta.alerta;
          this.titleRegistrar = this.popoverConsulta.titulo;
          this.showSuccess(this.popoverConsulta.alerta, 'danger');
          this.blockRegister=false;
          return;
        }
  
        let historia: IHistoria_paciente ={
          //fk_historia: this.historiaMedica.uid_historia,
          fecha_historia: fechaRegistro,
          indice: 0,
          motivo_historia: this.motivos.find((m: any) => {return m.uid==this.consultas.id_motivo }).descripcion,
          observacion: this.consultas.observaciones,
          fk_medico: this.consultas.id_medico,
        }

        const tieneHistoria: boolean = await this.srvVarios.nonEmptyValue(this.historiaMedica.uid_historia);        
        
        await this.srvConsultas.nuevo(this.consultas)
          .then(async results => {
            this.consultas=results;
            this.consultas.fecha = fechaConsulta;
            if (this.consultas?.uid && typeof this.consultas.uid === 'number'){
              if (tieneHistoria){
                historia.fk_historia = this.historiaMedica.uid_historia;
                this.srvHistorias.nuevoHistoriaPaciente(historia);
              }
              
              this.showSuccess('Atencion Medica Registrada Satisfactoriamente', 'success');
              this.buscarConsulta = {
                uidConsulta: this.consultas.uid.toString(),
                ciPaciente: 'null',
                uidMotivo: 'null',
                Motivo: 'null',
                fechaIni: 'null',
                fechaFin: 'null',
                Medico:this.tipoUser==='PARAMEDICO' ? this.user.login  : 'null',
                Paramedico: 'null',
                nombrePaciente:'null',
                cargo: 'null',
                fecha: 'null',
                condlogica: 'null',
                patologia: 'null',
              };
              await this.guardarSignosVit(fechaRegistro, this.paciente.ci );
              this.medicamentoAplicado.id_consulta=this.consultas.uid
              await this.guardarMedicametosAplicados();
              
              const solicitudValida: boolean = await this.srvVarios.nonEmptyValue(this.solicitud.uid);
              
              if (solicitudValida){
                await this.solicitudAtendida(this.consultas, this.paciente);
              }
  
              this.llenarArrayConsultas(true);
              console.log(`Reposo: ${this.consultas.id_reposo}`);
              this.enviarMotivoporCorreo(this.consultas.id_motivo,this.consultas.uid, this.consultas.id_reposo);
              if (this.idSolicitud){
                this.router.navigate(["serviciomedico/solicitudes"]);
              }
            }
            else{
              this.showSuccess('Error Registrando', 'danger');
            }
          })
          .catch(err => {
            this.showSuccess('Error Registrando: '+err, 'danger'); 
            console.error(err);
            this.blockRegister=false;
            this.soloLectura=false;
          });			
      }
      else {
        this.consultas.fecha = this.vConsultas.fecha;
        this.consultas.observacion_medicamentos = observacion;
        this.consultas.userModific = this.user.login;
        this.consultas.fechaModificacion = fechaRegistro;
        //console.log(this.consultas.fecha);
        await this.srvConsultas.actualizar(this.consultas)
          .toPromise()
          .catch(err => {
            this.showSuccess('Error actualizando: '+err, 'danger');
            console.log(err);
            this.blockRegister=false;
            this.soloLectura=false;
          });
        this.enviarMotivoporCorreo(this.consultas.id_motivo,this.consultas.uid, this.consultas.id_reposo);
        this.llenarArrayConsultas(false);
        this.showSuccess('Atencion Medica actualizada satisfactoriamente', 'success');
  
      }
      this.blockRegister=false;
      this.consultas = {};
      this.paciente={};    
      this.arrayReferencias=[];
      this.newConsulta = false;
      this.primaryModal.hide();
      this.soloLectura=false;
      
    } catch (error) {
      console.error(error);
      this.showSuccess(`${error}. Comuniquese con el Administrador del Sistema. Ext.#293`, 'danger');
      this.blockRegister=false;
      this.soloLectura=false;
    }    
  }

  async solicitudAtendida(newConsulta: IConsultas, paciente: IvPaciente){
    try {    
      const proxCitavalida: boolean = await this.srvVarios.nonEmptyValue(newConsulta.fecha_prox_cita);
      this.solicitud.estatus = proxCitavalida ? "PENDIENTE" : "CERRADA";
      this.solicitud.fecha_atencion = newConsulta.fecha;
      this.solicitud.fecha_salida = this.fechaSalida==this.solicitud.fecha_salida ? this.solicitud.fecha_salida : this.fechaSalida;
      this.solicitud.motivo = newConsulta.sintomas;
      this.solicitud.id_reposo = newConsulta.id_reposo;
      this.solicitud.id_medico = newConsulta.id_medico;
      this.solicitud.id_paramedico = newConsulta.id_paramedico;
      this.solicitud.observaciones = newConsulta.observaciones;
      this.solicitud.id_consulta = newConsulta.uid;
      this.solicitud.fecha_prox_cita = newConsulta.fecha_prox_cita;
      //console.log(this.solicitud);
      this.srvSolicitud.actualizar(this.solicitud).subscribe();
      this.srvSolicitud.registrarConsultaSolicitud({id_consulta: this.solicitud.id_consulta, id_solicitud: this.solicitud.uid, fecha_salida: this.solicitud.fecha_salida }).subscribe();
      
      let reposo: string;
      for await (let t of this.tiemposReposo){
        if (t.uid == newConsulta.id_reposo){
          reposo = t.descripcion;        
          break;
        }
      }
      
      let remitentes: string[] = await this.getRemitentes('SOLICITUD');
      remitentes.push(this.solicitud.email_solicitante);
      if (this.solicitud.email_supervisor){
        remitentes.push(this.solicitud.email_supervisor);
      }
      
      if (remitentes.length>0){
        const correos: string = remitentes.toString();
        const asunto: string =  `RE: Solicitud de Asistencia ID ${this.solicitud.uid}: Paciente ${paciente.nombre_completo}`;

        this.solicitud.fecha_atencion = await this.srvVarios.formateaFecha(this.solicitud.fecha_atencion.toString());
        this.solicitud.fecha_salida = await this.srvVarios.formateaFecha(this.solicitud.fecha_salida.toString());
        newConsulta.fecha_prox_cita = newConsulta.fecha_prox_cita!==undefined ? await this.srvVarios.formateaFecha(newConsulta.fecha_prox_cita) : undefined;
        
        const cuerpo: string = await this.srvSolicitud.cuerpoCorreoSolicitudAtendida(paciente, this.solicitud, newConsulta.fecha_prox_cita, reposo);
        const mailOptions: ImailOptions = {
          to: correos,
          subject: asunto,
          html: cuerpo,
        };
        this.enviarCorreoHTML(mailOptions)
        .then((result) => {
          if (result.info)
            this.showSuccess(`${asunto} Enviado a: ${correos}: `, 'warning');
          else
            this.showSuccess(`Error: ${result?.error}`, 'danger');
        });
      }
    } catch (error) {
      console.error(error);
      this.showSuccess(`Error: ${error}`, 'danger');
    }
  }

  addReferencia(){
    
    if (this.referencia.especialidad!="" && this.referencia.especialidad != undefined && this.referencia.informe!="" && this.referencia.informe != undefined){
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

  quitReferencia(ind: number){    
    this.arrayReferencias.splice(ind, 1);
  }
  
  async addMedicamento(){
    
    if (this.medicamentoAplic.id_medicamento!= undefined && this.medicamentoAplic.cantidad != undefined && this.medicamentoAplic.medidas!= undefined){      
      let _med: IMedicamento={};      

      for await (const value of this.arrayMedicamentos) {        
        if (value.uid==this.medicamentoAplic.id_medicamento){
          _med=value;          
          break;
        }  
      }
      
      const medicina: IMedicinasAplicadas={        
        medicamento: _med,
        cantidad: this.medicamentoAplic.cantidad,
        medidas: this.medicamentoAplic.medidas
      }
      
      this.medicamentoAplicado.medicamentos.push(medicina);
      this.alertaMedicamento='';
      this.titleMedicamento=''
      this.medicamentoAplic={};
    }
    else{
      this.titleMedicamento='Error: Campo Vacio';
      
      if (this.medicamentoAplic.id_medicamento== undefined){        
        this.alertaMedicamento='Debe Seleccionar Un Medicamento';
      }
      if (this.medicamentoAplic.cantidad == undefined){        
        this.alertaMedicamento='Debe Colocar una Cantidad';
      }
      if (this.medicamentoAplic.medidas){        
        this.alertaMedicamento='Debe Seleccionar una Medida';
      }
    }
  }

  quitMedicamento(ind: number){    
    this.medicamentoAplicado.medicamentos.splice(ind, 1);
  }

  async addIndicacion(){
    
    if (this.medicamentoIndic.medicamento != undefined && this.medicamentoIndic.indicacion != undefined){
      
      for await (const value of this.arrayMedicamentosIndicados) {
        //console.log(`this.medicamento: ${this.medicamentoIndic.medicamento}; valie.uid: ${value.uid}`);
        if (value.uid.toString()==this.medicamentoIndic.medicamento){
          this.medicamentoIndic.medicamento=value.descripcion;
          break;
        }  
      }
      
      this.medicamentoIndicados.push(this.medicamentoIndic);
      this.alertaIndicacion='';
      this.titleIndicacion='';
      this.medicamentoIndic={};
    }
    else{
      this.titleIndicacion='Error: Campo Vacio';
      if (this.medicamentoIndic.medicamento==undefined || this.medicamentoIndic.medicamento == undefined){
        this.alertaIndicacion='Debe Seleccionar un Medicamento';
      }
      if (this.medicamentoIndic.indicacion=="" || this.medicamentoIndic.indicacion == undefined){
        this.alertaIndicacion='Debe llenar El campo Indicacion';
      }
    }
  }

  quitIndicacion(ind: number){    
    this.medicamentoIndicados.splice(ind, 1);
  }

  collapsed(event: any): void {
    // console.log(event);
  }

  expanded(event: any): void {
    // console.log(event);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.iconCollapse = this.isCollapsed ? 'icon-arrow-down' : 'icon-arrow-up';

    this.isCollapsed_1 = !this.isCollapsed_1;
    this.iconCollapse_1 = this.isCollapsed_1 ? 'icon-arrow-down' : 'icon-arrow-up';
  }

  showSuccess(mensaje: string, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 15 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 15000
    });
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOptionPatolog = event.item;    
  }

  onSelectOption(_pat: IPatologia){
    
    this.selectedOptionPatolog = _pat;
    this.onInputChange();
    
    this.selectedPatolog = this.selectedOptionPatolog.descripcion;
    
  }

  private yaFueBuscadaAntes(){
    const posicion = this.queryPatologia.indexOf(this.selectedPatolog.toUpperCase());
    if (posicion > -1){
      return true;
    }
    else{
      this.queryPatologia.push(this.selectedPatolog.toUpperCase());
      return false
    }
  }

  async searchPatologiasInArray(){
    let encontrado: boolean =  false;
    if (this.selectedOptionPatolog && this.selectedOptionPatolog.codigo_etica!=null && this.selectedOptionPatolog.codigo_etica!=undefined){
      let posicion: number = await this.srvVarios.searchArrayObject(this.patologiasAll, this.selectedOptionPatolog.codigo_etica, 'codigo_etica')
      encontrado =  posicion >= 0 ? true : false;
    }
    return encontrado
  }

  async validarEntradaBusquedaPatologia(){    
    if (this.tipoUser!='SISTEMA' && this.tipoUser!='MEDICO' ){      
      return false;
    }
    if (this.selectedPatolog=='' || this.selectedPatolog=='SIN ESPECIFICACION'){      
      return false;
    }
    if (this.selectedOptionPatolog?.descripcion.trim() == this.selectedPatolog.trim()){      
      return false;
    }
    if (this.yaFueBuscadaAntes()){      
      return false;
    }
    if(await this.searchPatologiasInArray()){      
      return false;
    }
    return true;
  }

  async onSearchEnter() {
    if (this.selectedPatolog!='' && this.selectedPatolog!=undefined){
      if (await this.validarEntradaBusquedaPatologia()){
        
        this.loadingPatologia= true;
        this._patologias=[];
        let resultPatog: IPatologia[]=[];        
        
        const result = await this.srvPatologia.filterICD({ query: this.selectedPatolog }).toPromise();
        
        if (result.length>0){
          resultPatog = await Promise.all(result.map((res) => ({
            descripcion: res.release.code + ': ' + this.srvVarios.getContentFromEm(res.entity.title),
            tipo: this.tipoUser == 'SISTEMA' || this.tipoUser=='MEDICO' ? 'ICD' : 'NANDA',
            codigo_etica: res.release.code,
            url: res.entity.entity,
            estatus: true,
            view: this.tipoUser == 'SISTEMA' || this.tipoUser=='MEDICO' ? 1 : 2,
            definicion: res.release?.definicion !== undefined ? res.release?.definicion: '--',
          })));
          
          this._patologias = resultPatog.filter((p: IPatologia) => p.codigo_etica !== '');
          
          let nuevasPatol:IPatologia[]=[];
          this._patologias.forEach(async (res) => {
            const nuevaPatol:IPatologia = await this.insertarPatologia(res);
            
            if (nuevaPatol.uid){
              nuevasPatol.push(nuevaPatol);
              this.patologias.push(nuevaPatol);
            }
          });
          this._patologias = nuevasPatol;
          
          this.showSuggestions = true;
        }else{
          this.onInputChange();
        }
        
        this.loadingPatologia= false;
      }
    }
  }

  async insertarPatologia(_pat: IPatologia){
    let nuevaPatol:IPatologia={};
    let codigoEtica: string = _pat.codigo_etica==undefined || _pat.codigo_etica=='' ? 'null' : _pat.codigo_etica;
    const patologia= await this.srvPatologia.consultaFilter(undefined, undefined, codigoEtica, true, undefined, undefined).toPromise();    
    if (patologia.length==0){
      let pat: IPatologia = _pat;
      let arrpat: string[] = pat.descripcion.split(": ");
      pat.descripcion = arrpat[1].trim();
      pat.definicion = pat.definicion.replace(/—/g, '');      
      nuevaPatol = await this.srvPatologia.registrar(pat).toPromise();
      
    }
    return nuevaPatol;
  }

  onInputChange() {
    // Establecer la bandera en false para ocultar las sugerencias.
    this.showSuggestions = false;
  }

  async morbilidad(filtro: IFiltroConsulta){
    let data: any[]=[];
    let morbilidad: IvMorbilidad[]=[];
    let edad: any;
    
    await this.srvConsultas.morbilidadFilter(filtro)
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
    this.buscarConsulta.Medico = this.user.nivel != 1 ? this.user.login : 'null';
    const data: any[] = await this.morbilidad(this.buscarConsulta);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    await XLSX.writeFile(workbook, 'atencion.xlsx');
    this.titleButtonExport = 'Exportar';
    this.showSuccess(`Archivo Descargado. Revise su carpeta local de descargas`, 'primary');
  }

  obtenerArchivo(): Promise<Blob> {
    return new Promise(async (resolve, reject)  => {
      this.buscarConsulta.Medico = this.user.nivel === 1 ? 'null' : this.user.login;
      const data: any[] = await this.morbilidad(this.buscarConsulta);
      
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
      const archivo = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      resolve(archivo);
    });
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
        console.error(`Error: ${respuesta.error}`);
      }
    });
    return respuesta;
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

  async enviarCorreoHTML(mailOptions: ImailOptions) {
    let respuesta: any;
    respuesta = await this.srvCorreo.enviarBuffer(mailOptions);
    if (respuesta.error==undefined){
      console.log(`Info: ${respuesta?.info}`);
    }else{
      console.error(`Error: ${JSON.stringify(respuesta.error)}`);
    }
       
    return respuesta;
  }

  async enviarMotivoporCorreo(idMotivo: number, idConsulta: number, idReposo?: number){
    if (this.tipoUser==='MEDICO' || this.tipoUser==='SISTEMA'){
      let notaExamen: INotaExamen={};
      await this.srvConsultas.notaExamen(idConsulta)
        .then(async (res) => {
          notaExamen= res;
      });
      if (notaExamen.nombre_completo){
        //notaExamen.mor_fecha = formatDate(notaExamen.mor_fecha, 'dd-MM-yyyy HH:mm', this.locale);
        //console.log(notaExamen);
        notaExamen.mor_fecha = await this.srvVarios.formateaFecha(notaExamen.mor_fecha.toString());
        //console.log(notaExamen.mor_fecha);
        if (idMotivo==7 || idMotivo==8 || idMotivo==9 || idMotivo==10 || idMotivo==13){ 
        // console.log(`Motivo: ${idMotivo}`);     
          if (idMotivo==7 || idMotivo==8 || idMotivo==9 || idMotivo==10){
            const asuntoExamen = this.motivos.find( m => m.uid === idMotivo ).descripcion + " " + notaExamen.nombre_completo;
            const cuerpoExamen: string = await this.srvConsultas.cuerpoDelExamen(notaExamen);
            this.enviarExamenCorreo(asuntoExamen, cuerpoExamen, notaExamen.desc_mot);
          }
          if (idMotivo==7 || idMotivo==8 || idMotivo==9 || idMotivo==10 || idMotivo==13){
            const asuntoCertificado: string = `Certificado Medico ${notaExamen.nombre_completo}`;        
            const cuerpoCertificado: string = this.srvConsultas.planilla_certificado(notaExamen.mor_sex, notaExamen.mor_cond, idMotivo, notaExamen.mor_fecha, notaExamen.nombre_completo, notaExamen.mor_ci, notaExamen.mor_cargo, notaExamen.desc_mot, notaExamen.firma_dr);

            this.enviarExamenCorreo(asuntoCertificado, cuerpoCertificado, notaExamen.desc_mot);
          }
        }
        const reposoValido: boolean = await this.srvVarios.nonEmptyValue(idReposo);
        if (reposoValido && idReposo!=0){
          const asuntoReposo: string = "REPOSO " + notaExamen.nombre_completo;        
          const cuerpoReposo: string = await this.srvConsultas.cuerpoDelReposo(notaExamen);
          this.enviarExamenCorreo(asuntoReposo, cuerpoReposo, "REPOSO");
        }
      }
    }
  }

  async enviarExamenCorreo(asunto: string, cuerpo: string, actividad: string){
    const remitentes: string[] = await this.getRemitentes(actividad);
    if (remitentes.length>0){
      const correos: string = remitentes.toString();
      const mailOptions: ImailOptions = {
        to: correos,
        subject: `${asunto}`,
        html: cuerpo,
      };
      this.enviarCorreoHTML(mailOptions)
      .then((result) => {
        if (result.info)
          this.showSuccess(`${asunto} Enviado a: ${correos}: `, 'warning');
        else
          this.showSuccess(`Error: ${result?.error}`, 'danger');
      });
    }
  }
}
