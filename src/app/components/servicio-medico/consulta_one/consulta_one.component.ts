import { Component, ViewChild, OnChanges, Inject, Input,  LOCALE_ID } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { Ipopover } from '../../../models/servicio-medico/varios.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IConsultas, IConsultasConstraint, IvConsulta, IFiltroConsulta, Ireferencia } from '../../../models/servicio-medico/consultas.model';
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
import { IHistoria_medica, IHistoria_paciente } from '../../../models/servicio-medico/historias.model'

//servicios
import { ConsultasService } from '../../../services/servicio_medico/consultas.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';
import { MedicosService } from '../../../services/servicio_medico/medicos.service';
import { MotivosService } from '../../../services/servicio_medico/motivos.service';
import { AreasService } from '../../../services/servicio_medico/areas.sevice';
import { PatologiasService } from '../../../services/servicio_medico/patologias.service';
import { AfeccionesService } from '../../../services/servicio_medico/afecciones.service';
import { SignosVitalesService } from '../../../services/servicio_medico/signosvitales.service';
import { RemitidosService } from '../../../services/servicio_medico/remitidos.service';
import { TiempoReposoService } from '../../../services/servicio_medico/tiemporeposos.service';
import { AntropometriaService } from '../../../services/servicio_medico/antropometria.service';
import { MedicamentosService } from '../../../services/servicio_medico/medicamentos.service';
import { HistoriaService } from '../../../services/servicio_medico/historias.service';

@Component({
  selector: 'app-consulta_one',
  templateUrl: './consulta_one.component.html',  
  styleUrls: ['./consulta_one.component.css'],
  providers: [ ConsultasService, PacientesService, MedicosService, MotivosService, AreasService, PatologiasService, 
    AfeccionesService, SignosVitalesService, RemitidosService, TiempoReposoService, AntropometriaService,
    MedicosService, HistoriaService,
    { provide: AlertConfig }],
})
export class ConsultaOneComponent implements OnChanges { 
  
  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  
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
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';

  isCollapsed_1: boolean = true;
  iconCollapse_1: string = 'icon-arrow-down';
  
   fechaIni: string;
   fechaFin: string;  
   user: IUsuarios={};
   tipoUser: string;
   buscarConsulta: IFiltroConsulta;
   consultasTodas: IvConsulta[];
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
   motivos: IMotivo[]=[];
   areas: IAreas[]=[];
   selectedPatolog: string;
   patologias: IPatologia[] = [];
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
   historiaMedica: IHistoria_medica={};  
   turno: number;
   condiciones =[
    {valor:'N/A', display:'No Aplica'}, {valor: 'APTO', display:'APTO'},
    {valor:'NO APTO', display:'NO APTO'}, {valor:'APTO RESTR', display:'APTO CON RESTRICCIONES'}
  ];
  soloLectura: boolean;
  @Input() uidConsulta: string = "-1"; 

  ngOnChanges(): void {
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
    
    this.uidConsulta = this.route.snapshot.paramMap.get("uidConsulta")==undefined? this.uidConsulta.toString(): this.route.snapshot.paramMap.get("uidConsulta");    
    
    this.limpiarFiltro();    
    this.llenarArrayMotivos();
    this.llenarArrayAreas();
    this.llenarArrayPatologias();
    this.llenarArrayAfecciones();
    this.llenarArrayRemitidos();
    this.llenarArrayTiempoReposo();
    this.llenarArraymedicamentos('EXISTECIA');    
    this.consultasFilter();
  }
  
  private async limpiarFiltro(){
    this.buscarConsulta = { 
    uidConsulta: this.uidConsulta,
    ciPaciente: 'null',
    Motivo: 'null',
    uidMotivo: 'null',
    fechaIni: 'null',
    fechaFin: 'null',
    Medico:'null',
    Paramedico: 'null',
    nombrePaciente: 'null',
    cargo: 'null',
    fecha: 'null',
    condlogica: 'OR'
  }
}

  private async consultasFilter() {
    
		return await this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()
      .then(result => {
        this.showRegistro(result[0]);
      })			
			.catch(err => { console.log(err) });
	}

  private llenarArrayPatologias(){
    this.srvPatologia.patologiasAll()
      .toPromise()
      .then(result => {
        this.patologias=result;
        this.selectedOptionPatolog= this.patologias.find(p => p.descripcion=='SIN ESPECIFICACION')
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
      });

    await  this.srvMedicos.paraMedicosAll()
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
  
  buscarPaciente(){
    if (this.paciente.ci!="" &&  this.paciente.ci!= undefined){
      this.srvPacientes.pacienteOne(this.paciente.ci)
      .toPromise()
      .then(result => {
        if (result[0]!= undefined){
          this.paciente=result[0];
          this.buscarHistoriaPaciente(this.paciente.uid_paciente);
        }
        else
          this.paciente={} 
        
      })
    }    
  }

  async buscarHistoriaPaciente(idpaciente: number){
    if ( idpaciente!= undefined){
      await this.srvHistorias.historiaMedicaOne('null', idpaciente.toString())
      .toPromise()
      .then((result) => {
        this.historiaMedica=result;
      })      
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
  
   buscarSignosVitales(ci: string, fecha: string){
    if (ci!="" &&  ci!= undefined){
      
      this.srvSignosVitales.signosVitalesOne(ci, formatDate(fecha, 'yyyy-MM-dd HH:mm', this.locale))
      .toPromise()
      .then(result => {
        if (result[0]!= undefined)
          this.signoVital=result[0];
        else
          this.signoVital={} 
        
      });
      this.srvAntropometria.antropometriaOne(ci, formatDate(fecha, 'yyyy-MM-dd HH:mm', this.locale))
      .toPromise()
      .then(result => {
        if (result[0]!= undefined)
          this.antropometria=result[0];
        else
          this.antropometria={} 
        
      });
    }    
  }

  verTurno(){
    let tiempo=formatDate(Date.now(), 'HH:mm:ss', this.locale);
    let array = tiempo.split(':');
    let hora=Number(array[0]);
    if (hora>=23 && hora<7){
      this.turno=1;
    }
    if(hora>=7 && hora<15){
        this.turno=2;
    } 
    if(hora>=15 && hora<23){
          this.turno=3;
    }    
  }

  chequeaAutorizacionMotivo(idMotivo: number){
    if (idMotivo==1){
      this.autorizacion=true;
    }else{
      this.autorizacion=false
    }
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

  private async  showRegistro(item: IvConsulta){
    this.soloLectura=true;
    if (this.tipoUser=='SISTEMA'){
      this. soloLectura=false;
    }
    this.signoVital = {};
    this.antropometria={};
    this.medicamentoAplicado={};
    this.arrayReferencias=[];
    this.medicamentoIndicados=[];
    await this.llenarArrayMedicosALL();
    this.selectParamedicos= this.paramedicos;
    this.selectMedicos= this.medicos;    
    this.turno=item.turno;    
    this.consultas={};
    this.paciente={};
    this.consultas = {
      fecha: item.fecha,
      uid: item.uid,      
      id_motivo: item.idmotivo,
      id_area: item.id_area,      
      fkafeccion: item.fkafeccion,      
      condicion: item.condicion,
      fecha_prox_cita: item.fecha_prox_cita,
      sintomas: item.sintomas,
      observaciones: item.observaciones,
      resultado_eva: item.resultado_eva,
      observacion_medicamentos: item.observacion_medicamentos,
      autorizacion: item.autorizacion,
      turno: item.turno,
    }

    for await (let i of this.selectParamedicos){      
      if (i.ci==item.ci_paramedico){
        this.consultas.id_paramedico = i.uid;        
        break;
      }
    }

    for await (let m of this.selectMedicos){
      if (m.ci==item.ci_medico){
        this.consultas.id_medico = m.uid;        
        break;
      }
    }

    for await (let r of this.remitidos){
      if (r.descripcion==item.reposo){
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

    for await (let pt of this.patologias){
      if (pt.descripcion==item.patologia){
        this.selectedOptionPatolog= pt;
        this.selectedPatolog=pt.descripcion
        break;
      }
    }
    
    this.buscarSignosVitales(item.ci, item.fecha);    
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
    
  }

  async guardarSignosVit(_fecha: string, _cedula: string){    
    if (_fecha!=undefined && _cedula!=undefined){      
      //if (this.signoVital.fcard!=undefined || this.signoVital.pulso!=undefined || this.signoVital.temper!=undefined || this.signoVital.tart!=undefined || this.signoVital.fresp!=undefined){          
          this.signoVital.cedula=_cedula;
          this.signoVital.fecha=_fecha;          
          await this.srvSignosVitales.registrar(this.signoVital).toPromise();
      //}
      //if (this.antropometria.imc!=undefined || this.antropometria.talla!=undefined || this.antropometria.peso!=undefined){        
          this.antropometria.fecha=_fecha;
          this.antropometria.cedula=_cedula
          await this.srvAntropometria.registrar(this.antropometria).toPromise();
     // }  
    }
  }

  calc_imc(){    
        let talla = Number(this.antropometria.talla);
        let peso = Number(this.antropometria.peso);        
        this.antropometria.imc= this.srvAntropometria.calculoImc(talla, peso);
  }

  async guardarMedicametosAplicados(){
    let medAplic: IMedicamentosAplicados;
    const idConsul: number = this.medicamentoAplicado.id_consulta;

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
  }  

  private async  validaEntradas(idPaciente: number, fechaCons: string){
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

    if ((this.consultas.condicion == undefined || this.consultas.condicion=="N/A") && (this.consultas.id_motivo==8 || this.consultas.id_motivo==7)){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Seleccione la Condicion del Paciente"
      };      
      return  popOver;
    }

    this.buscarConsulta = { 
      uidConsulta: 'null',
      ciPaciente: idPaciente.toString(),
      Motivo: 'null',
      fechaIni: fechaCons,
      fechaFin: fechaCons,
      Medico:'null',
      Paramedico: 'null',
      nombrePaciente: 'null',
      cargo: 'null',
      uidMotivo: 'null',
      fecha: 'null',
      condlogica: 'AND'
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

  async registrar(){
    this.popoverConsulta={};
    let msjAviso: string;
    if (this.newConsulta) {
      let consultaNew: IvConsulta={};
      let referenciaMedica: string="";
      for (let i=0; i< this.arrayReferencias.length; i++){
        referenciaMedica = referenciaMedica + ">>" + this.arrayReferencias[i].especialidad.toUpperCase().trim() + ":" + "\n" + this.arrayReferencias[i].informe.trim() + "\n";
      }
      let indicaciones: string="";
      for (let j=0; j< this.medicamentoIndicados.length; j++){
        indicaciones = indicaciones + decodeURI(this.medicamentoIndicados[j].medicamento)  + ": " + this.medicamentoIndicados[j].indicacion + "\n";

        //console.log(`medic:${this.medicamentoIndicados[j].medicamento}; decode: ${decodeURI(this.medicamentoIndicados[j].medicamento)}; indica: ${this.medicamentoIndicados[j].indicacion}; `)
      }      
      
      this.consultas={
        uid: undefined,
        id_paciente: this.paciente.uid_paciente,
        fecha: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale),        
        id_patologia: this.selectedOptionPatolog.uid,        
        fecha_registro: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale),
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
        condicion: this.consultas.condicion,
        sintomas: this.consultas.sintomas,
        observaciones: this.consultas.observaciones,
        resultado_eva: this.consultas.resultado_eva,
        observacion_medicamentos: this.consultas.observacion_medicamentos
        
      };

      this.popoverConsulta = await this.validaEntradas(this.consultas.id_paciente, this.consultas.fecha);
      
      if ( this.popoverConsulta.alerta!=undefined){        
        this.alertaRegistrar = this.popoverConsulta.alerta;
        this.titleRegistrar = this.popoverConsulta.titulo 
        return;
      }

      let historia: IHistoria_paciente ={
        fk_historia: this.historiaMedica.uid_historia,
        fecha_historia: this.consultas.fecha,
        indice: 0,
        motivo_historia: this.motivos.find((m: any) => {return m.uid==this.consultas.id_motivo }).descripcion,
        observacion: this.consultas.observaciones,
        fk_medico: this.consultas.id_medico,      
      }
      
			this.srvConsultas.nuevo(this.consultas)				
				.then(results => {
          this.consultas=results;
          if (this.consultas.uid && typeof this.consultas.uid === 'number'){
            historia.fk_consulta=this.consultas.uid;
            this.srvHistorias.nuevoHistoriaPaciente(historia);
            this.showSuccess('Atencion Medica Registrada Satisfactoriamente', 'success');                     
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
    this.paciente={};    
    this.arrayReferencias=[];
		this.newConsulta = false;
    this.historiaMedica={};  
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

  showSuccess(mensaje: string, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
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

  onSelect(event: TypeaheadMatch): void {
    this.selectedOptionPatolog = event.item;
    console.log(this.selectedOptionPatolog);
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }
}