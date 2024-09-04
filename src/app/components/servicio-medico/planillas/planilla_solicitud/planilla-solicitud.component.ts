import { Component, OnChanges, Input, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';

//servicios
import { PacientesService } from '../../../../services/servicio_medico/pacientes.service';

//modelos
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { ISolicitudesAtenciones } from '../../../../models/servicio-medico/solicitudatencion.model';
import { IvPaciente } from '../../../../models/servicio-medico/paciente.model';


@Component({
  selector: 'planilla-solicitud',
  templateUrl: './planilla-solicitud.html',
  //providers: [ConsultasService, ],
  styleUrls: ['../planilla_style.css']
})

export class planillaSolicitudComponent implements OnChanges {
  idConsulta: string;
  paciente: IvPaciente={};
  @ViewChild('htmltable', {static: false}) htmltable: ElementRef;
  @Input() inSolicitud: ISolicitudesAtenciones = {};
  
  private user: IUsuarios={};
  incorporacionTrabajo: string="";
  reposoRestoTurno: string="";
  private tipoUser: string;
  titleButtonImp: string = "Imprimir PDF";
  disableButtonImp: boolean = false;
  edad: string ="";
  constructor(private route: ActivatedRoute,private router: Router,
    
    private srvPaciente: PacientesService,
    @Inject(LOCALE_ID) public locale: string,
    ) { }

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
        
        this.getPaciente(this.inSolicitud.ci_paciente);
        console.log(this.inSolicitud)
        this.inSolicitud.medico = await this.isValid(this.inSolicitud.medico) ? this.inSolicitud.medico : "                       ";
        this.inSolicitud.paramedico = await this.isValid(this.inSolicitud.paramedico) ? this.inSolicitud.paramedico : "                       ";
        
        const reposoValido: boolean = await this.isValidReposo(this.inSolicitud.reposo);
        console.log(reposoValido)
        //|| this.inSolicitud.reposo == 'N/A'
        if (reposoValido){            
            this.incorporacionTrabajo = "../../../assets/check_vacio_1.jpg";
            this.reposoRestoTurno = "../../../assets/check_green_1.jpg";
        }else{
            const paramedicoValido: boolean = await this.isValid(this.inSolicitud.paramedico);
            const medicoValido: boolean = await this.isValid(this.inSolicitud.medico);
            if (paramedicoValido || medicoValido){
                this.incorporacionTrabajo = "../../../assets/check_green_1.jpg";
                this.reposoRestoTurno = "../../../assets/check_vacio_1.jpg";
            }else{
                this.incorporacionTrabajo = "../../../assets/check_vacio_1.jpg";
                this.reposoRestoTurno = "../../../assets/check_vacio_1.jpg";
            }
            
        }
    }

    async isValid(control: any) {
        return control !== undefined && control !== null && control !== '';
    }

    async isValidReposo(control: any) {
        return control !== undefined && control !== null && control !== ''  && control != 'N/A';
    }

    async getPaciente(ci:string){        
        await this.srvPaciente.pacienteOne(ci)
        .toPromise()
        .then(result =>{
            if (result){
                this.paciente = result[0];
                this.edad = this.paciente.edad.years;
                //this.paciente.cargo = this.paciente.cargo.replace(/ /g, "&nbsp;  &nbsp; ");
            }
        })        
    }

    public exportHtmlToPDF(){
        this.titleButtonImp = "Loading...";
        this.disableButtonImp = true;
        let data = document.getElementById('htmltable');
     
        html2canvas(data).then(canvas => {
            
            let doc = new jsPDF('p', 'mm', 'letter');

            doc.html(data, {
                callback: () => {
                    // Utiliza una función de flecha para mantener el contexto
                    this.disableButtonImp = false;
                    this.titleButtonImp = "Imprimir PDF";         
                    doc.save(`solicitud-${this.inSolicitud.paciente}.pdf`);
                },
                x: 5,
                y: 5,
                width: 190, 
                windowWidth: 850,
            });
        });
    }

}