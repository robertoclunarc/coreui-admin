import { Component, OnChanges, Input, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

//servicios
import { HistoriaService } from '../../../../services/servicio_medico/historias.service';
import { ConsultasService } from '../../../../services/servicio_medico/consultas.service';
import { PacientesService } from '../../../../services/servicio_medico/pacientes.service';
import { CargosAnterioresService } from '../../../../services/servicio_medico/cargos_anteriores.service';
import { AntecedentesFamiliaresService } from '../../../../services/servicio_medico/antecedentesfamiliares.service';
import { AntecedentesOcupacionalesService } from '../../../../services/servicio_medico/antecedentesocupacionales.service';
import { AnatomiasService } from '../../../../services/servicio_medico/anatomia.service';
import { HabitosService } from '../../../../services/servicio_medico/habitos.service';
import { IHabito, IvHabitos, IHabitoPaciente } from '../../../../models/servicio-medico/habitos.model';
import { IAnalisisPsicologico, IEstudioPsicologico, IAnamnesisPsicologico } from '../../../../models/servicio-medico/anamnesispsicologico.model';
import { SignosVitalesService } from '../../../../services/servicio_medico/signosvitales.service';
import { AntropometriaService } from '../../../../services/servicio_medico/antropometria.service';
import { EstudiosFisicosService } from '../../../../services/servicio_medico/estudiofisico.service';
import { MedicosService } from '../../../../services/servicio_medico/medicos.service';

//modelos
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { IConsultas, IvConsulta, IFiltroConsulta, Ireferencia, IvMorbilidad } from '../../../../models/servicio-medico/consultas.model';
import { IvPaciente } from '../../../../models/servicio-medico/paciente.model';
import { ICargoAnterior, ICargoAnteriorOtra } from '../../../../models/servicio-medico/cargos_anteriores.model';
import { IAntecedentesFamiliares } from '../../../../models/servicio-medico/antecedentesfamiliares.model';
import { IRiesgosHistorias } from '../../../../models/servicio-medico/historiamedica.model';
import { IAnatomia, IExamenesFuncionales, IExamenFuncional } from '../../../../models/servicio-medico/anatomias.model';
import { AnamnesisPsicologicoService } from '../../../../services/servicio_medico/anamnesispsicologico.service';
import { IsignosVitales } from '../../../../models/servicio-medico/signos_vitales.model';
import { Iantropometria } from '../../../../models/servicio-medico/antropometria.model';
import { IEstudiosFisico, IExamenFisico, IExamenesFisicosPacientes  } from '../../../../models/servicio-medico/estudiofisico.model';
import { IHistoria_medica } from '../../../../models/servicio-medico/historias.model';
import { IMedicos } from '../../../../models/servicio-medico/medicos.model';

@Component({
  selector: 'planilla-historia',
  templateUrl: './planilla-historia.component.html',
  providers: [HistoriaService],
  styleUrls: ['../planilla_style.css']
})

export class planillaHistoriaComponent implements OnChanges {
  @ViewChild('htmltable', {static: false}) htmltable: ElementRef; // hmtl del div que va a imprimir
  @ViewChild('htmlhead', {static: false}) htmlhead: ElementRef; // hmtl del encabezado para cada pagina
  @ViewChild('htmlpage1', {static: false}) htmlPage1: ElementRef;// hmtl de la pagina 1
  @ViewChild('htmlPage2', {static: false}) htmlPage2: ElementRef;// hmtl de la pagina 2
  @ViewChild('htmlPage3', {static: false}) htmlPage3: ElementRef;// hmtl de la pagina 3
  @Input() inIDProtocolo: string = "-1";
  @Input() inCiPaciente: string = "-1"; 
  paciente: IvPaciente={};
  historiaMedica: IHistoria_medica ={};
  medico: IMedicos={};
  cargosAnteriores: ICargoAnterior[]=[];
  cargosAnterioresOtras: ICargoAnteriorOtra[]=[];
  antecedentesFamiliares: IAntecedentesFamiliares[]=[];
  antecedentesOcupacionales: IRiesgosHistorias[]=[];
  examenes: IExamenesFuncionales[]=[];
  ArrayHabitos: IHabito[];
  habitosPacientes: IvHabitos[]=[];
  estudiosPacientes: IAnamnesisPsicologico[]=[]; 
  analisisPaciente: IAnalisisPsicologico={};
  private ArrayEstudios: IEstudioPsicologico[];   
  
  arrayTiposEvaluciones: {tipoevaluacion: string, index: number, cantItem: number}[]=[];
  arrayTiposEvalucionesPage1: {tipoevaluacion: string, index: number, cantItem: number}[]=[];// tipos evaluaciones que estaran en la pagina 1
  arrayTiposEvalucionesPage2: {tipoevaluacion: string, index: number, cantItem: number}[]=[];// tipos evaluaciones que estaran en la pagina 2
  arrayTiposEvalucionesPage3: {tipoevaluacion: string, index: number, cantItem: number}[]=[];// tipos evaluaciones que estaran en la pagina 3
  /*arrayEvaluaciones: IEvaluaciones_PosibleResp[]=[ { evaluaciones: {}, posibles_resp: []} ];
  arrayPosiblesRespEndocrinas: IPosibles_resp_endocrinas[]=[];
  arrayRespuestas: IRespuestas_pacientes_eval_endocrino[]=[];
  arrayEvaluacionesConRespuestas:  { // todas las evaluaciones
    evaluaciones?: IEvaluaciones_endocrinas, 
    posibles_resp?: {
        idposibleresp?: number,
        fkevaluacion?: number,
        descripcion?: string,
        posible_resp?: string,      
        index?: number,
    }[],    
  }[] = [];
  arrayEvaluacionesConRespuestasPage1:  { // evaluaciones que estaran el la pagina 1
    evaluaciones?: IEvaluaciones_endocrinas, 
    posibles_resp?: {
        idposibleresp?: number,
        fkevaluacion?: number,
        descripcion?: string,
        posible_resp?: string,      
        index?: number,
    }[],    
  }[] = [];
  arrayEvaluacionesConRespuestasPage2:  { // evaluaciones que estaran el la pagina 2
    evaluaciones?: IEvaluaciones_endocrinas, 
    posibles_resp?: {
        idposibleresp?: number,
        fkevaluacion?: number,
        descripcion?: string,
        posible_resp?: string,      
        index?: number,
    }[],    
  }[] = [];
  arrayEvaluacionesConRespuestasPage3:  { // evaluaciones que estaran el la pagina 3
    evaluaciones?: IEvaluaciones_endocrinas, 
    posibles_resp?: {
        idposibleresp?: number,
        fkevaluacion?: number,
        descripcion?: string,
        posible_resp?: string,      
        index?: number,
    }[],    
  }[] = [];*/
  titleButtonImp: string = "Imprimir PDF";
  disableButtonImp: boolean = false;
  encabezados: HTMLElement[]=[];
  totalpages: number = 3;//cantidad de paginas del documento pdf
  pagina1: number[] = [1,2,3]; // tipos indices que estaran el la pagina 1
  pagina2: number[] = [4,5];// tipos indices que estaran el la pagina 2
  pagina3: number[] = [6,7,8];// tipos indices que estaran el la pagina 3
  //arrayProtocolo: IvProtocoloEndrocrinos[]=[];
  //protocolo: IvProtocoloEndrocrinos={};
  private user: IUsuarios={};
  private tipoUser: string;  
  revisiones: number = 0;
  //protocoloObj: IvProtocoloEndrocrinos={ paciente: {}, medico: {}, protocolo:{} };
  constructor(
    private route: ActivatedRoute,private router: Router,
    private srvPacientes: PacientesService,
    private srvHistorias: HistoriaService,
    private srvMedico: MedicosService,
    private srvCargoAnterior: CargosAnterioresService,
    private srvAntecedentesFamiliares: AntecedentesFamiliaresService,
    private srvAntecedentesOcupacionales: AntecedentesOcupacionalesService,
    private srvAnatomia: AnatomiasService,
    private srvHabitos: HabitosService,
    private srvAnamnesis: AnamnesisPsicologicoService,
    @Inject(LOCALE_ID) public locale: string,
    ) { 
      this.generar_encabezados();
      this.llenarArrayhabitos();
      this.llenarArrayEstudios()
    }

  ngOnChanges() {
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

    /*this.llenarArrayRespuestas();    
    this.llenarArrayProtocolos();*/
    this.buscarPaciente();
  }

  async buscarPaciente(){
    
    if (this.inCiPaciente!="" && this.inCiPaciente!= undefined && this.inCiPaciente!= "-1"){
      await this.srvPacientes.pacienteOne(this.inCiPaciente)
      .toPromise()
      .then(async result => {
        if (result[0]!= undefined){
          this.paciente=result[0];
          this.paciente.fechanac= formatDate(this.paciente.fechanac, 'dd-MM-yyyy', 'en');
          this.paciente.fecha_ingreso=formatDate(this.paciente.fecha_ingreso, 'dd-MM-yyyy', 'en');
          this.paciente.antiguedad_puesto=formatDate(this.paciente.antiguedad_puesto, 'dd-MM-yyyy', 'en');
          this.paciente.turno = this.paciente.turno == '1' ? 'Diurno' : 'Rotativo';
          //this.gerencia.uid = this.arrayGerencias.find( (g: any) => {return g.nombre==this.paciente.gcia}).uid;
          console.log(this.paciente.uid_paciente);
          await this.buscarHistoriaPaciente(this.paciente.uid_paciente);
          this.buscarCargos(this.paciente.uid_paciente);
          this.buscarCargosOtras(this.paciente.uid_paciente);
          this.buscarAntecedentesFamiliares(this.paciente.uid_paciente);
          this.buscarAntecedentesOcupacionales(this.paciente.uid_paciente);
          this.buscarExamenesFuncionales(this.paciente.ci);
          this.buscarHabitosPorPaciente(this.paciente.ci);
          this.buscarEstudiosPorPaciente(this.paciente.ci);
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
        if (result){
          this.historiaMedica=result;
          this.historiaMedica.fecha_apertura = formatDate(this.historiaMedica.fecha_apertura, 'dd-MM-yyyy', 'en');
          console.log(this.historiaMedica.fk_medico);
          this.buscarMedico(this.historiaMedica.fk_medico);
        }
        else{
          this.historiaMedica={};          
        }  
      })      
    }    
  }

  async buscarMedico(idMedico: number){    
    if ( idMedico!= undefined){
      await this.srvMedico.medicosOne(idMedico)
      .toPromise()
      .then((result) => {
        if (result){
          this.medico=result[0];          
        }
        else{
          this.medico={};         
        }  
      })      
    }    
  }

  private async buscarCargos(idpaciente: number){    
    if (idpaciente!= undefined){
      await this.srvCargoAnterior.cargosAnterioresAll(idpaciente.toString())
      .toPromise()
      .then(result => {
        if (result.length>0){
          this.cargosAnteriores=result;          
        }
        else
          this.cargosAnteriores=[];
      })
    }      
  }

  private async buscarCargosOtras(idpaciente: number){    
    if (idpaciente!= undefined){
      await this.srvCargoAnterior.cargosAnterioresOtrasAll(idpaciente.toString())
      .toPromise()
      .then(result => {
        if (result.length>0){
          this.cargosAnterioresOtras=result;          
        }
        else
          this.cargosAnterioresOtras=[];
      })
    }      
  }

  private async buscarAntecedentesFamiliares(idpaciente: number){
    if (idpaciente!= undefined){
      await this.srvAntecedentesFamiliares.AntecedentesFamiliaresOnePaciente(idpaciente.toString())
      .toPromise()
      .then(result => {
        if (result.length>0){
          this.antecedentesFamiliares=result;
        }
        else{
          this.antecedentesFamiliares=[];
        }
      })
    }
  }

  private async buscarAntecedentesOcupacionales(idpaciente: number){
    if (idpaciente!= undefined){
      await this.srvAntecedentesOcupacionales.riesgosPaciente(idpaciente.toString())
      .toPromise()
      .then(async result => {
        if (result.length>0){
          this.antecedentesOcupacionales=result;
        }
        else{
          await this.buscarPaciente();
          this.antecedentesOcupacionales=[];
        }
      })
    }
  }

  private async buscarExamenesFuncionales(cedula: string){
    if (cedula!= undefined && cedula!= null && cedula!=""){
      await this.srvAnatomia.examenesFuncionales(cedula)
      .toPromise()
      .then(async result => {
        if (result.length>0){
          this.examenes=result;          
        }
        else{
          this.examenes=[];
        }
      })
    }
  }

  private async buscarHabitosPorPaciente(cedula: string){
    let habitosP: IvHabitos;
    let obs: string="";
    let rsp: string="";    
    if (cedula!= undefined && cedula!= null && cedula!=""){
      await this.srvHabitos.habitosPorCedula(cedula)
      .toPromise()
      .then(async result => {
        for await (let hab of this.ArrayHabitos){
          habitosP={};
          obs="";
          rsp="";
          for await (let hp of result){            
            if (hp.habito.uid_habito==hab.uid_habito){
              obs=hp.observacion;
              rsp=hp.resp
            }
          }
          habitosP={
              cedula: cedula,
              habito: hab,
              observacion: obs,
              resp:  rsp
          };
          this.habitosPacientes.push(habitosP);          
        }
      })
    }
  }

  private async llenarArrayhabitos(){
    await this.srvHabitos.habitosAll()
    .toPromise()
    .then(result => {
      if (result){
        this.ArrayHabitos=result;
      }
      else
      this.ArrayHabitos=[];
    })
  }

  private async buscarEstudiosPorPaciente(cedula: string){
    let analisisP: IAnamnesisPsicologico;
    let obs: string="";
    let fecha: string="";
    if (cedula!= undefined && cedula!= null && cedula!=""){
      await this.srvAnamnesis.estudiosPsicologicosPorCedula(cedula)
      .toPromise()
      .then(async result => {
        for await (let anm of this.ArrayEstudios){
          analisisP={};
          obs="";
          fecha="";
          for await (let es of result){
            if (es.estudio.uid_estudio==anm.uid_estudio){
              obs=es.observacion;
              if (es.fecha_estudio==null || es.fecha_estudio==undefined || es.fecha_estudio=="")
                  fecha=es.fecha_estudio
              else
                  fecha=formatDate(es.fecha_estudio, 'dd-MM-yyyy', 'en')
            }
          }
          analisisP={
              cedula: cedula,
              estudio: anm,
              observacion: obs,
              fecha_estudio: fecha
          };
          this.estudiosPacientes.push(analisisP);
        }        
      })
    }    
  }

  private async llenarArrayEstudios(){    
      await this.srvAnamnesis.estudiosPsicologicosAll()
      .toPromise()
      .then(result => {
        if (result){ 
          
          this.ArrayEstudios=result;          
        }
        else
          this.ArrayEstudios=[];        
      })       
  }

  /*async llenarArrayProtocolos() {    
    
    await this.srvProtocolo.consultaFilter({ ciPaciente: this.inCiPaciente, idProtocolo: 'null', fechaIni: 'null',  fechaFin: 'null',  medico: 'null',  uidPaciente: 'null', condlogica: 'OR' })		
      .then(async results => {				
        this.arrayProtocolo = results;        
        this.revisiones = results.length;
        //console.log(this.arrayProtocolo);
        this.protocoloObj = this.arrayProtocolo.find(p=>p.protocolo.idprotocolo.toString()==this.inIDProtocolo);            
        this.protocoloObj.protocolo.emision= formatDate(this.protocoloObj.protocolo.emision, 'yyyy-MM-dd', this.locale);
        this.protocoloObj.protocolo.vigencia= formatDate(this.protocoloObj.protocolo.vigencia, 'yyyy-MM-dd', this.locale);
        this.protocoloObj.protocolo.proxima_cita= formatDate(this.protocoloObj.protocolo.proxima_cita, 'yyyy-MM-dd', this.locale);
        this.protocoloObj.protocolo.lugar = this.protocoloObj.protocolo.lugar.replace(/ /g, '   ')
        
        await this.generar_encabezados();
      })
      .catch(err => { console.log(err) });
  }  */

  /*async llenarArrayEvaluacionesAll(){       
    await this.srvProtocolo.EvalPosiblesRespEndocrinasAll()
    .then(result => {
      if (result.length>0){
        this.arrayEvaluaciones = result;//result.filter((e)=>{return e.evaluaciones.tipoindice==this.tipoIndice})         
      }
      else{
        this.arrayEvaluaciones=[];
      } 
       console.log(this.arrayEvaluaciones)      
    })       
  }*/

  /*async llenarArrayPosiblesRespEndocrinasAll(){    
    
    await this.srvProtocolo.posiblesRespEndocrinasAll()    
    .then(async result => {
      if (result[0]!= undefined){
        this.arrayPosiblesRespEndocrinas=result;
        
      }
      else{
        this.arrayPosiblesRespEndocrinas=[]; 
      }
      
    })       
  }*/

  /*async llenarArrayTipoEvaluaciones(){    
    
    await this.srvProtocolo.evaluacionesEndocrinasAllxTipo()
    .then(async result => {
      if (result.length>0){
        this.arrayTiposEvaluciones=result;
        this.arrayTiposEvalucionesPage1 = this.arrayTiposEvaluciones.filter(t => this.pagina1.includes(t.index));
        this.arrayTiposEvalucionesPage2 = this.arrayTiposEvaluciones.filter(t => this.pagina2.includes(t.index));
        this.arrayTiposEvalucionesPage3 = this.arrayTiposEvaluciones.filter(t => this.pagina3.includes(t.index));
        
      }
      else{
        this.arrayTiposEvaluciones=[]; 
      } 
      //console.log(this.arrayTiposEvaluciones)

    })       
  }*/

  /*async PosiblesRespEndocrinasID(idposibleResp: number){    
    for await (let pos of this.arrayPosiblesRespEndocrinas){
      if (pos.idposibleresp==idposibleResp)
        return pos;
    }     
  } */ 

  async llenarArrayRespuestas(){    
    /*this.arrayRespuestas=[];
    this.arrayEvaluacionesConRespuestas=[];
    this.arrayEvaluacionesConRespuestasPage1=[];
    this.arrayEvaluacionesConRespuestasPage2=[];
    this.arrayEvaluacionesConRespuestasPage3=[];*/
    let respuesta: {
        idposibleresp?: number,
        fkevaluacion?: number,
        descripcion?: string,
        posible_resp?: string,      
        index?: number,
      }[];

    //await this.llenarArrayTipoEvaluaciones();
    //await this.llenarArrayEvaluacionesAll();
    //await this.llenarArrayPosiblesRespEndocrinasAll();
    
    //this.arrayRespuestas = await this.srvProtocolo.respuestasPacientesEvalEndocrino('undefined', this.inIDProtocolo, undefined);
        
    let res: any;
   /* if (this.arrayRespuestas.length>0){         
      
      for await (let eva of this.arrayEvaluaciones){        
        
        respuesta=[];
        
        for await (let pos of eva.posibles_resp) {
          
          for await (let resp of this.arrayRespuestas){
            if (resp.fkposible_resp==pos.idposibleresp){
                res =  (await this.PosiblesRespEndocrinasID(resp.fkposible_resp)).posible_resp;                
                respuesta.push({
                    idposibleresp: resp.fkposible_resp,
                    fkevaluacion: eva.evaluaciones.idevaluacion,
                    posible_resp: resp.respuesta,
                    descripcion: res,
                    index: eva.evaluaciones.indice,
                });
            }
          }
        }
        eva.evaluaciones.descripcion_evaluacion=eva.evaluaciones.descripcion_evaluacion.trim();*/
        /*this.arrayEvaluacionesConRespuestas.push({evaluaciones:eva.evaluaciones, posibles_resp: respuesta });
        this.arrayEvaluacionesConRespuestas[0].evaluaciones.tipoevaluacion
      }*/
      /*this.arrayEvaluacionesConRespuestasPage1 = this.arrayEvaluacionesConRespuestas.filter(t => this.pagina1.includes(t.evaluaciones.tipoindice));
      this.arrayEvaluacionesConRespuestasPage2 = this.arrayEvaluacionesConRespuestas.filter(t => this.pagina2.includes(t.evaluaciones.tipoindice));
      this.arrayEvaluacionesConRespuestasPage3 = this.arrayEvaluacionesConRespuestas.filter(t => this.pagina3.includes(t.evaluaciones.tipoindice));
    }*/
   
  }

  public async exportHtmlToPDF(){
    this.titleButtonImp = "Loading...";
    this.disableButtonImp = true;
    const chart1 = document.getElementById('htmlpage1');
    const chart2 = document.getElementById('htmlpage2');
    const chart3 = document.getElementById('htmlpage3');    
    const docHeight: number = 37;
    const docWidth: number = 190;
    const doc = new jsPDF('p', 'mm', 'letter');
    
    /*
    let headerText: any;    
    headerText = await this.HeadHtml(1);    
    const contentDataURL = await html2canvas(headerText).then(canvas => canvas.toDataURL('image/png'));
    const addHeader = () => {
            doc.setFontSize(12);                
            doc.addImage(headerText, 'PNG', 8, 5, docWidth + 8, docHeight);
          };
    */         
            
    doc.html(chart1, {
      callback: function () {
       // addHeader();
        doc.addPage();        
        doc.html(chart2, {
        callback: function () {
          //addHeader();
          doc.addPage();
          doc.html(chart3, {
          callback: function () {
            //addHeader();            
            // Guardar el archivo PDF
            this.disableButtonImp = false;
            this.titleButtonImp = "Imprimir PDF";            
            doc.save('protEndocrino.pdf');
          },
          x: 12,
          y: 564,
          width: docWidth, //target width in the PDF document
          windowWidth: 850 //window width in CSS pixels
          });
        },
        x: 12,
        y: 283,
        width: docWidth,
        windowWidth: 850
        });
      },
      x: 12,
      y: 5,
      width: docWidth,
      windowWidth: 850
    });        
  }

  async pageHeadHtml(page: number) {
    /*const codigo: number = this.protocoloObj.protocolo.idprotocolo;
    const revision: number = this.revisiones;
    const emision: string = this.protocoloObj.protocolo.emision;
    const vigencia: string = this.protocoloObj.protocolo.vigencia;
    const cedula: string = this.protocoloObj.paciente.ci;
    let nombre: string =  this.protocoloObj.paciente.nombre_completo;    
    nombre = nombre.replace(/ /g, "&nbsp;  &nbsp; ");    
    const edad: string = this.protocoloObj.paciente.edad?.years;
    const sx: string = this.protocoloObj.paciente.sexo;*/
    let data: string = `<table style="table-layout: fixed; width: 100%; font-size: 14px;" width="100%">
    <colgroup>
        <col style="width: 20%">
        <col style="width: 50%">        
    </colgroup>
    <thead>
      <tr>
        <td><img width="110px" height="60px" src="../../../../assets/logo.jpg"></td>
        <th>
          <span style="font-weight:bold;font-style:italic; text-align: center; font-size: 14px;">HISTORIA MEDICA OCUPACIONAL</span><br>          
        </th>        
      </tr>
    </thead>
    </table>`;
    const html: string = `<div id="htmlhead">${data}</div>`;
    
    return html;
  }
  
  async generar_encabezados(){
    let htmlString: string="";
    let element: HTMLElement;    
    for (let i=1; i<=this.totalpages; i++){      
      htmlString = await this.pageHeadHtml(i);      
      element = await this.HeadHtml(htmlString);
      this.encabezados.push(element);
    }
  }

  async HeadHtml(html: string) {
    const parser = new DOMParser();
    let element: HTMLElement;
    let doc: Document;
    doc = parser.parseFromString(html, 'text/html');
    element = doc.body.firstChild as HTMLElement;
    return element;
  }
    
}