import { Component, OnChanges, Input, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

//servicios
import { ConsultasService } from '../../../../services/servicio_medico/consultas.service';
import { SignosVitalesService } from '../../../../services/servicio_medico/signosvitales.service';
import { AntropometriaService } from '../../../../services/servicio_medico/antropometria.service';
import { MedicamentosService } from '../../../../services/servicio_medico/medicamentos.service';

//modelos
import { IvConsulta, IFiltroConsulta, Ireferencia, IvMorbilidad } from '../../../../models/servicio-medico/consultas.model';
import { IsignosVitales } from '../../../../models/servicio-medico/signos_vitales.model';
import { Iantropometria  } from '../../../../models/servicio-medico/antropometria.model';
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { ImedicamentosConsulta } from '../../../../models/servicio-medico/medicamentos.model';

@Component({
  selector: 'planilla-consulta',
  templateUrl: './planilla_consulta.html',
  providers: [ConsultasService, SignosVitalesService, AntropometriaService, MedicamentosService],
  styleUrls: ['../planilla_style.css']
})

export class planillaConsultaComponent implements OnChanges {
  id: string;
  @ViewChild('htmltable', {static: false}) htmltable: ElementRef;
  @Input() uidPaciente: string = "-1";
  vConsulta: IvConsulta={};
  vMorbilidad: IvMorbilidad={};
  signoVital: IsignosVitales={};
  antropometria: Iantropometria={};
  private buscarConsulta: IFiltroConsulta;
  medicamentoAplicado: ImedicamentosConsulta ={};
  countMedicamentos: number=0
  private user: IUsuarios={};
  private tipoUser: string;
  titleButtonImp: string = "Imprimir PDF";
  disableButtonImp: boolean = false;

  constructor(private route: ActivatedRoute,private router: Router,
    private srvConsultas: ConsultasService,    
    private srvSignosVitales: SignosVitalesService,    
    private srvAntropometria: AntropometriaService,
    private srvMedicamentos: MedicamentosService,
    @Inject(LOCALE_ID) public locale: string,
    ) { }

  ngOnChanges() {
    if (sessionStorage.currentUser){  

      this.user=JSON.parse(sessionStorage.currentUser);
      
      if (this.user) {
           
        this.tipoUser= sessionStorage.tipoUser;
        this.id = this.route.snapshot.paramMap.get("uid")==undefined? this.uidPaciente: this.route.snapshot.paramMap.get("uid");
       
      }
      else {
            this.router.navigate(["serviciomedico/login"]);
      }
    }else{
      this.router.navigate(["serviciomedico/login"]);
    }
    if (this.id!=undefined && this.id!="-1"){
      this.consultasFilter(this.id);
      this.morbilidadFilter(this.id);
      this.buscarMedicamentosAplicados(parseInt(this.id));
    }
  }

  private async consultasFilter(uid: string) {
    this.limpiarFiltro();
    this.buscarConsulta.uidConsulta=uid;
		return await this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()
      .then(results => {				
				this.vConsulta = results[0];
        this.vConsulta.observacion_medicamentos = this.vConsulta.observacion_medicamentos.replace(/<br>/g, "; ").replace(/\n/g, " ");
        console.log(this.vConsulta);
        this.buscarSignosVitales(this.vConsulta.ci, this.vConsulta.fecha);				
			})			
			.catch(err => { console.log(err) });
	}

  private async morbilidadFilter(uid: string) {
    this.limpiarFiltro();
    this.buscarConsulta.uidConsulta=uid;
		return await this.srvConsultas.morbilidadFilter(this.buscarConsulta)
			.toPromise()
      .then(results => {				
				this.vMorbilidad = results[0];				
			})			
			.catch(err => { console.log(err) });
	}

  private async limpiarFiltro(){
      this.buscarConsulta = { 
      uidConsulta: 'null',
      ciPaciente: 'null',
      Motivo: 'null',
      uidMotivo: 'null',
      fechaIni: 'null',
      fechaFin: 'null',
      Medico:'null',
      Paramedico: 'null',
      nombrePaciente: 'null',
      cargo: 'null',
      fecha: 'null'
    }
  }

  private buscarMedicamentosAplicados(idConsulta: number){
    if ( idConsulta!= undefined){
      this.srvMedicamentos.medicamentosAplicados(idConsulta)
      .toPromise()
      .then(result => {
        if (result!= undefined){           
           this.medicamentoAplicado=result;
           this.countMedicamentos= this.medicamentoAplicado.medicamentos==undefined ? 0 : this.medicamentoAplicado.medicamentos.length;
        }
        else
          this.medicamentoAplicado={}
      })
    }    
  }

  private buscarSignosVitales(ci: string, fecha: string){
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

  public exportHtmlToPDF(){
    this.titleButtonImp = "Loading...";
    this.disableButtonImp = true;
    let data = document.getElementById('htmltable');
     
      html2canvas(data).then(canvas => {
          
          let docWidth = 208;
          let docHeight = canvas.height * docWidth / canvas.width;
          
          const contentDataURL = canvas.toDataURL('image/png')
          let doc = new jsPDF('p', 'mm', 'letter');
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight)
          
          doc.save('consulta.pdf');
          this.titleButtonImp = "Imprimir PDF";
          this.disableButtonImp = false;
      });
  }

}