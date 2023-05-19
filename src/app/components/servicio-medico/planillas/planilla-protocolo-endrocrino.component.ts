import { Component, OnChanges, Input, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
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
  element: HTMLElement;
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
    console.log(`Paciente: ${this.inIDProtocolo}`);
    this.llenarArrayRespuestas();
    //this.buscarPaciente();
    this.llenarArrayProtocolos();
  }

  async buscarPaciente(){    
    await this.srvPacientes.pacienteOne('16395343')
    .toPromise()
    .then(async result => {
      if (result[0]!= undefined){
        
        this.protocoloObj.paciente=result[0];        
        this.protocoloObj.protocolo.lugar="PUERTO ORDAZ";          
        this.protocoloObj.protocolo.emision= formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
        this.protocoloObj.protocolo.vigencia= formatDate(Date.now(), 'yyyy-MM-dd', this.locale);
        
      }
      else
        this.protocoloObj.paciente={};      
    })
  }

  async llenarArrayProtocolos() {
    const htmlString: string = await this.pageHeadHtml(1);
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    await this.srvProtocolo.consultaFilter({ ciPaciente: '16395343', idProtocolo: 'null', fechaIni: 'null',  fechaFin: 'null',  medico: 'null',  uidPaciente: 'null', condlogica: 'OR' })		
        .then(results => {				
            this.arrayProtocolo = results;        
            this.revisiones = results.length;
            //console.log(this.arrayProtocolo);
            this.protocoloObj = this.arrayProtocolo.find(p=>p.protocolo.idprotocolo==63);
            this.element = doc.body.firstChild as HTMLElement;
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
       //console.log(this.arrayEvaluaciones)      
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
    
    this.arrayRespuestas = await this.srvProtocolo.respuestasPacientesEvalEndocrino('undefined', '63', undefined);
        
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
    const data = document.getElementById('htmlhead_1');
    //console.log(data);
    const chart1 = document.getElementById('htmlpage1');
    const chart2 = document.getElementById('htmlpage2');
    const chart3 = document.getElementById('htmlpage3');    
    const docHeight: number = 37;
    const docWidth: number = 190;
    const doc = new jsPDF('p', 'mm', 'letter');
    
    let headerText: HTMLElement = await this.HeadHtml(1);
    
    console.log(headerText);
    console.log(data);
    const contentDataURL = await html2canvas(headerText).then(canvas => canvas.toDataURL('image/png'));
    const addHeader = () => {
            doc.setFontSize(12);                
            doc.addImage(contentDataURL, 'PNG', 8, 5, docWidth + 8, docHeight);
          };           
            
    doc.html(chart1, {
      callback: function () {
        addHeader();
        doc.addPage();
        doc.html(chart2, {
        callback: function () {
          addHeader();
          doc.addPage();
          doc.html(chart3, {
          callback: function () {
            addHeader();            
            // Guardar el archivo PDF            
            doc.save('protEndocrino.pdf');
          },
          x: 12,
          y: 604,
          width: docWidth, //target width in the PDF document
          windowWidth: 850 //window width in CSS pixels
          });
        },
        x: 12,
        y: 323,
        width: docWidth,
        windowWidth: 850
        });
      },
      x: 12,
      y: 45,
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
    const nombre: string = this.protocoloObj.paciente.nombre_completo;
    const edad: string = this.protocoloObj.paciente.edad?.years;
    const sx: string = this.protocoloObj.paciente.sexo;
    let data = `<table class="tg">
    <colgroup>
        <col>
        <col>
        <col>
    </colgroup>
    <thead>
      <tr>
        <td class="tg-c3ow"><img width="130px" height="80px" src="../../../../assets/logo.jpg"></td>
        <td class="tg-c3ow"><span>DEPTO. DE HIGIENE Y SEGURIDAD INDUSTRIAL</span><br>
                            <span>EVALUACION FISICA</span><br>
                            <span>DEL PROTOCOLO ENDOCRINO</span>
                            <span>METABOLICO / CARDIOVASCULAR</span>                                   
        </td>
        <td class="tg-c3ow">
            <span>CODIGO: 63</span><br>
            <span>PAGINA: 1 de 3 REV. N°:1</span><br>
            <span>EMISION: 2023-05-11T04:00:00.000Z</span><br>
            <span>VIGENCIA: 2023-05-11T04:00:00.000Z</span>
        </td>
      </tr>
      <tr>
        <td class="tg-c3ow"></td>
        <td class="tg-c3ow"></td>
        <td class="tg-c3ow"></td>
      </tr>

      <tr bgcolor="#F0ECEC">
        <td class="tg-c3ow">CEDULA: 
            <span>16395343</span>
        </td>
        <td class="tg-c3ow">
            NOMBRE:
            <span>ROBERTO CARLOS LUNAR.G</span>
        </td>
        <td class="tg-c3ow">
            EDAD: <span>41</span>
            SEXO: <span>M</span>
        </td>
      </tr>
       
    </thead>
    <tbody><tr>
        <th colspan="3" width="110%"><span>Información a Evaluar</span></th>
    </tr>
</tbody></table>`;
    
    return data;
  }

  async HeadHtml(page: number) {
    const parser = new DOMParser();    
    let data = await this.pageHeadHtml(page);
    data =  '<div _ngcontent-jtf-c121 id="htmlhead_1" class="container-fluid">' + data + '</div>';
    let head = parser.parseFromString(data, 'text/html');
    return head.body.firstChild as HTMLElement;
  }
    
}