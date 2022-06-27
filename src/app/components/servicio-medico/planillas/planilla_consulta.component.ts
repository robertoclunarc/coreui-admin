import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

//servicios
import { ConsultasService } from '../../../services/servicio_medico/consultas.service';
import { SignosVitalesService } from '../../../services/servicio_medico/signosvitales.service';
import { AntropometriaService } from '../../../services/servicio_medico/antropometria.service';
import { MedicamentosService } from '../../../services/servicio_medico/medicamentos.service';

//modelos
import { IvConsulta, IFiltroConsulta, Ireferencia, IvMorbilidad } from '../../../models/servicio-medico/consultas.model';
import { IsignosVitales } from '../../../models/servicio-medico/signos_vitales.model';
import { Iantropometria  } from '../../../models/servicio-medico/antropometria.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { ImedicamentosConsulta } from '../../../models/servicio-medico/medicamentos.model';

@Component({
  selector: 'planilla-root',
  templateUrl: './planilla_consulta.html',
  providers: [ConsultasService, SignosVitalesService, AntropometriaService, MedicamentosService],
  //styleUrls: ['./app.component.scss']
})

export class planillaConsultaComponent implements OnInit {
  id: string;
  
  private vConsulta: IvConsulta={};
  private vMorbilidad: IvMorbilidad={};
  private signoVital: IsignosVitales={};
  private antropometria: Iantropometria={};
  private buscarConsulta: IFiltroConsulta;
  private medicamentoAplicado: ImedicamentosConsulta ={};
  private countMedicamentos: number=0
  private user: IUsuarios={};
  private tipoUser: string;

  constructor(private route: ActivatedRoute,private router: Router,
    private srvConsultas: ConsultasService,    
    private srvSignosVitales: SignosVitalesService,    
    private srvAntropometria: AntropometriaService,
    private srvMedicamentos: MedicamentosService,
    @Inject(LOCALE_ID) public locale: string,
    ) { }

  ngOnInit(): void {
    if (sessionStorage.currentUser){  

      this.user=JSON.parse(sessionStorage.currentUser);
      if (this.user) {
           
        this.tipoUser= sessionStorage.tipoUser;
        this.id = this.route.snapshot.paramMap.get("uid");
      }
      else {
            this.router.navigate(["login"]);
      }
    }else{
      this.router.navigate(["login"]);
    }
    this.consultasFilter(this.id);
    this.morbilidadFilter(this.id);
    this.buscarMedicamentosAplicados(parseInt(this.id));
  }

  private async consultasFilter(uid: string) {
    this.limpiarFiltro();
    this.buscarConsulta.uidConsulta=uid;
		return await this.srvConsultas.consultaFilter(this.buscarConsulta)
			.toPromise()
      .then(results => {				
				
				this.vConsulta = results[0];
        this.buscarSignosVitales(this.vConsulta.ci, this.vConsulta.fecha);
				
			})			
			.catch(err => { console.log(err) });
	}

  private async morbilidadFilter(uid: string) {
    this.limpiarFiltro();
    this.buscarConsulta.uidConsulta=uid;
		return await this.srvConsultas.morbilidadFilter('null','null',uid,'null','null','null','null','null')
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
           this.countMedicamentos= this.medicamentoAplicado.medicamentos==undefined ? 0 : this.medicamentoAplicado.medicamentos.length ;           
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
    let data = document.getElementById('htmltable');
      
      html2canvas(data).then(canvas => {
          
          let docWidth = 208;
          let docHeight = canvas.height * docWidth / canvas.width;
          
          const contentDataURL = canvas.toDataURL('image/png')
          let doc = new jsPDF('p', 'mm', 'letter');
          let position = 0;
          doc.addImage(contentDataURL, 'PNG', 0, position, docWidth, docHeight)
          
          doc.save('consulta.pdf');
      });
  }

}