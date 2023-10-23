import { Component, OnChanges, Input, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

//servicios
import { PacientesService } from '../../../../services/servicio_medico/pacientes.service'

//modelos
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { IvPaciente } from '../../../../models/servicio-medico/paciente.model';
import { IFiltroConsulta } from '../../../../models/servicio-medico/consultas.model';
import { ConsultasService } from '../../../../services/servicio_medico/consultas.service';


@Component({
  selector: 'planilla-autorizacion',
  templateUrl: './planilla_autorizacion.html',
  providers: [PacientesService, ],
  styleUrls: ['../planilla_style.css']
})

export class planillaAutorizacion implements OnChanges {
  ci: string;
  @ViewChild('htmltable', {static: false}) htmltable: ElementRef;
  @Input() inCiPaciente: string = "-1";
  paciente: IvPaciente;
  private buscarConsulta: IFiltroConsulta={};
  private user: IUsuarios={};
  private tipoUser: string;
  titleButtonImp: string = "Imprimir PDF";
  disableButtonImp: boolean = false;
  fecha: string;
  constructor(private route: ActivatedRoute,private router: Router,
    private srvPacientes: PacientesService,
    private srvConsultas: ConsultasService,
    @Inject(LOCALE_ID) public locale: string,
    ) { }

    ngOnChanges() {
        if (sessionStorage.currentUser){  

            this.user=JSON.parse(sessionStorage.currentUser);
        
            if (this.user) {            
                this.tipoUser= sessionStorage.tipoUser;
                this.ci = this.route.snapshot.paramMap.get("inCiPaciente")==undefined? this.inCiPaciente: this.route.snapshot.paramMap.get("inCiPaciente");        
            }
            else {
                this.router.navigate(["serviciomedico/login"]);
            }
        }else{
            this.router.navigate(["serviciomedico/login"]);
        }
        if (this.ci!=undefined && this.inCiPaciente!="-1"){      
            this.buscarPaciente();
            
        }
    }

    async buscarPaciente(){
    
        if (this.ci!="" && this.inCiPaciente!= undefined && this.inCiPaciente!= "-1"){
          await this.srvPacientes.pacienteOne(this.ci)
          .toPromise()
          .then(async result => {
            if (result[0]!= undefined){
              this.paciente=result[0];
              this.paciente.fechanac= formatDate(this.paciente.fechanac, 'dd-MM-yyyy', 'en');
              this.paciente.fecha_ingreso=formatDate(this.paciente.fecha_ingreso, 'dd-MM-yyyy', 'en');
              this.paciente.antiguedad_puesto=formatDate(this.paciente.antiguedad_puesto, 'dd-MM-yyyy', 'en');
              this.paciente.turno = this.paciente.turno == '1' ? 'Diurno' : 'Rotativo';
              this.morbilidadFilter(this.paciente.ci);
            }
            else
              this.paciente={}
          })
        }
    }

    private async morbilidadFilter(ci: string) {
        this.limpiarFiltro();
        this.buscarConsulta.Motivo = 'PRE EMPLEO';
        this.buscarConsulta.ciPaciente = ci;
        await this.srvConsultas.morbilidadFilter(this.buscarConsulta)
            .toPromise()
            .then(results => {
                console.log(results);
                if (results.length>0){
                    this.fecha = formatDate(results[0].fecha, 'yyyy-MM-dd HH:mm:ss', this.locale);
                }
                else{
                    this.fecha = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', this.locale);
                }
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
        fecha: 'null',
        condlogica: 'and'
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
            
            doc.save('autorizacion.pdf');
            this.titleButtonImp = "Imprimir PDF";
            this.disableButtonImp = false;
        });
    }

}