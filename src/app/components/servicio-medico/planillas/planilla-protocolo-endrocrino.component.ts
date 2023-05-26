import { Component, OnChanges, Input, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

//servicios
import { ProtocolosEndocrinosService } from '../../../services/servicio_medico/protocolo_endocrino.service';
import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

//modelos
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { IEvaluaciones_PosibleResp, IPosibles_resp_endocrinas, IRespuestas_pacientes_eval_endocrino, IEvaluaciones_endocrinas } from '../../../models/servicio-medico/protocolo_endocrino.model';
import { IvProtocoloEndrocrinos } from '../../../models/servicio-medico/protocolo_endocrino.model';

@Component({
  selector: 'planilla-protocolo-endocrino',
  templateUrl: './planilla-protocolo-endocrino.component.html',
  providers: [ProtocolosEndocrinosService],
  styleUrls: ['./planilla_consulta.css']
})

export class planillaProtocoloEndocrinoComponent implements OnChanges {
  
  @ViewChild('htmlhead', {static: false}) htmlhead: ElementRef;
  @ViewChild('htmlpage1', {static: false}) htmlPage1: ElementRef;
  @ViewChild('htmlPage2', {static: false}) htmlPage2: ElementRef;
  @ViewChild('htmlPage3', {static: false}) htmlPage3: ElementRef;
  @Input() inIDProtocolo: string = "-1";
  @Input() inCiPaciente: string = "-1";  
  arrayTiposEvaluciones: {tipoevaluacion: string, index: number, cantItem: number}[]=[];
  arrayTiposEvalucionesPage1: {tipoevaluacion: string, index: number, cantItem: number}[]=[];
  arrayTiposEvalucionesPage2: {tipoevaluacion: string, index: number, cantItem: number}[]=[];
  arrayTiposEvalucionesPage3: {tipoevaluacion: string, index: number, cantItem: number}[]=[];
  arrayEvaluaciones: IEvaluaciones_PosibleResp[]=[ { evaluaciones: {}, posibles_resp: []} ];
  arrayPosiblesRespEndocrinas: IPosibles_resp_endocrinas[]=[];
  arrayRespuestas: IRespuestas_pacientes_eval_endocrino[]=[];
  arrayEvaluacionesConRespuestas:  { 
    evaluaciones?: IEvaluaciones_endocrinas, 
    posibles_resp?: {
        idposibleresp?: number,
        fkevaluacion?: number,
        descripcion?: string,
        posible_resp?: string,      
        index?: number,
    }[],    
  }[] = [];
  encabezados: HTMLElement[]=[];
  totalpages: number = 3;
  arrayProtocolo: IvProtocoloEndrocrinos[]=[];
  protocolo: IvProtocoloEndrocrinos={};
  private user: IUsuarios={};
  private tipoUser: string;
  revisiones: number = 0;
  protocoloObj: IvProtocoloEndrocrinos={ paciente: {}, medico: {}, protocolo:{} };
  constructor(
    private route: ActivatedRoute,private router: Router,
    private srvPacientes: PacientesService,
    private srvProtocolo: ProtocolosEndocrinosService,
    @Inject(LOCALE_ID) public locale: string,
    ) { 
        this.llenarArrayTipoEvaluaciones();
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
    console.log(`Protocolo: ${this.inIDProtocolo}`);
    this.llenarArrayRespuestas();    
    this.llenarArrayProtocolos();
    
  }

  async llenarArrayProtocolos() {    
    
    await this.srvProtocolo.consultaFilter({ ciPaciente: this.inCiPaciente, idProtocolo: 'null', fechaIni: 'null',  fechaFin: 'null',  medico: 'null',  uidPaciente: 'null', condlogica: 'OR' })		
      .then(async results => {				
        this.arrayProtocolo = results;        
        this.revisiones = results.length;
        //console.log(this.arrayProtocolo);
        this.protocoloObj = this.arrayProtocolo.find(p=>p.protocolo.idprotocolo.toString()==this.inIDProtocolo);            
        this.protocoloObj.protocolo.emision= formatDate(this.protocoloObj.protocolo.emision, 'yyyy-MM-dd', this.locale);
        this.protocoloObj.protocolo.vigencia= formatDate(this.protocoloObj.protocolo.vigencia, 'yyyy-MM-dd', this.locale);
        this.protocoloObj.protocolo.proxima_cita= formatDate(this.protocoloObj.protocolo.proxima_cita, 'yyyy-MM-dd', this.locale);
        
        await this.generar_encabezados();
      })
      .catch(err => { console.log(err) });
  }  

  async llenarArrayEvaluacionesAll(){       
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
  }

  async llenarArrayPosiblesRespEndocrinasAll(){    
    
    await this.srvProtocolo.posiblesRespEndocrinasAll()    
    .then(async result => {
      if (result[0]!= undefined){
        this.arrayPosiblesRespEndocrinas=result;
        
      }
      else{
        this.arrayPosiblesRespEndocrinas=[]; 
      }
      
    })       
  }

  async llenarArrayTipoEvaluaciones(){    
    
    await this.srvProtocolo.evaluacionesEndocrinasAllxTipo()
    .then(async result => {
      if (result.length>0){
        this.arrayTiposEvaluciones=result;
        this.arrayTiposEvalucionesPage1 = this.arrayTiposEvaluciones.filter(t => (t.index==1 || t.index==2 || t.index==3));
        this.arrayTiposEvalucionesPage2 = this.arrayTiposEvaluciones.filter(t => (t.index==4 || t.index==5));
        this.arrayTiposEvalucionesPage3 = this.arrayTiposEvaluciones.filter(t => (t.index==6 || t.index==7 || t.index==8));
        /*console.log(this.arrayTiposEvaluciones);
        console.log(this.arrayTiposEvalucionesPage1);
        console.log(this.arrayTiposEvalucionesPage2);*/
      }
      else{
        this.arrayTiposEvaluciones=[]; 
      } 
      //console.log(this.arrayTiposEvaluciones)

    })       
  }

  async PosiblesRespEndocrinasID(idposibleResp: number){    
    for await (let pos of this.arrayPosiblesRespEndocrinas){
      if (pos.idposibleresp==idposibleResp)
        return pos;
    }     
  }  

  async llenarArrayRespuestas(){    
    this.arrayRespuestas=[];
    this.arrayEvaluacionesConRespuestas=[];    
    let respuesta: {
        idposibleresp?: number,
        fkevaluacion?: number,
        descripcion?: string,
        posible_resp?: string,      
        index?: number,
      }[];

    //await this.llenarArrayTipoEvaluaciones();
    await this.llenarArrayEvaluacionesAll();
    await this.llenarArrayPosiblesRespEndocrinasAll();
    
    this.arrayRespuestas = await this.srvProtocolo.respuestasPacientesEvalEndocrino('undefined', this.inIDProtocolo, undefined);
        
    let res: any;
    if (this.arrayRespuestas.length>0){         
      
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
        eva.evaluaciones.descripcion_evaluacion=eva.evaluaciones.descripcion_evaluacion.trim();
        this.arrayEvaluacionesConRespuestas.push({evaluaciones:eva.evaluaciones, posibles_resp: respuesta });
        
      }
      
    }    
    //console.log(this.arrayEvaluacionesConRespuestas)
  }

  public async exportHtmlToPDF(){    
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
    const codigo: number = this.protocoloObj.protocolo.idprotocolo;
    const revision: number = this.revisiones;
    const emision: string = this.protocoloObj.protocolo.emision;
    const vigencia: string = this.protocoloObj.protocolo.vigencia;
    const cedula: string = this.protocoloObj.paciente.ci;
    let nombre: string =  this.protocoloObj.paciente.nombre_completo;    
    nombre = nombre.replace(/ /g, "&nbsp;  &nbsp; ");    
    const edad: string = this.protocoloObj.paciente.edad?.years;
    const sx: string = this.protocoloObj.paciente.sexo;
    let data: string = `<table style="table-layout: fixed; width: 100%; font-size: 10px;" width="100%">
    <colgroup>
        <col style="width: 20%">
        <col style="width: 50%">
        <col style="width: 30%">
    </colgroup>
    <thead>
      <tr>
        <td><img width="130px" height="80px" src="../../../../assets/logo.jpg"></td>
        <td>
          <span style="font-weight:bold;font-style:italic; text-align: center; font-size: 10px;">DEPTO. &nbsp; DE &nbsp;  HIGIENE &nbsp;  Y &nbsp;  SEGURIDAD &nbsp;  INDUSTRIAL</span><br>
          <span style="font-weight:bold;font-style:italic; text-align: center;">EVALUACION &nbsp;  FISICA</span><br>
          <span style="font-weight:bold;font-style:italic; text-align: center;">DEL &nbsp; PROTOCOLO &nbsp; ENDOCRINO</span><br>
          <span style="font-weight:bold;font-style:italic; text-align: center;">METABOLICO &nbsp; / &nbsp; CARDIOVASCULAR</span>                                   
        </td>
        <td>
          <span>CODIGO : ${codigo}</span><br>
          <span>PAG. : ${page} de ${this.totalpages}. REV.&nbsp; N°:${revision}</span><br>
          <span>EMISION : ${emision}</span><br>
          <span>VIGENCIA: ${vigencia}</span>
        </td>
      </tr>
      <tr>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr bgcolor="#F0ECEC">
        <td>CEDULA&nbsp; :&nbsp;  <span>${cedula}</span>
        </td>
        <td>
            NOMBRE&nbsp; :&nbsp; <span>${nombre}</span>
        </td>
        <td>
            EDAD&nbsp; :&nbsp; <span>${edad}</span>
            SEXO&nbsp; :&nbsp; <span>${sx}</span>
        </td>
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