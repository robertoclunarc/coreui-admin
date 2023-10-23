import { Component, OnChanges, Input, Inject, LOCALE_ID, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

//servicios
import { ConsultasService, } from '../../../../services/servicio_medico/consultas.service';

//modelos
import { IUsuarios } from '../../../../models/servicio-medico/usuarios.model';
import { IvConsulta, IFiltroConsulta, Ireferencia } from '../../../../models/servicio-medico/consultas.model';

@Component({
  selector: 'planilla-referencia',
  templateUrl: './planilla-referencia.html',
  providers: [ConsultasService, ],
  styleUrls: ['../planilla_style.css']
})

export class planillaReferenciaComponent implements OnChanges {
  idConsulta: string;
  @ViewChild('htmltable', {static: false}) htmltable: ElementRef;
  @Input() inIdConsulta: string = "-1";
  private filtro: IFiltroConsulta={};
  private user: IUsuarios={};
  private tipoUser: string;
  titleButtonImp: string = "Imprimir PDF";
  disableButtonImp: boolean = false;
  
  consulta: IvConsulta = {};
  arrayReferencias: Ireferencia[]=[];
  constructor(private route: ActivatedRoute,private router: Router,
    
    private srvConsultas: ConsultasService,
    @Inject(LOCALE_ID) public locale: string,
    ) { }

    ngOnChanges() {
        if (sessionStorage.currentUser){  

            this.user=JSON.parse(sessionStorage.currentUser);
        
            if (this.user) {            
                this.tipoUser= sessionStorage.tipoUser;
                this.idConsulta = this.route.snapshot.paramMap.get("inIdConsulta")==undefined? this.inIdConsulta: this.route.snapshot.paramMap.get("inIdConsulta");        
            }
            else {
                this.router.navigate(["serviciomedico/login"]);
            }
        }else{
            this.router.navigate(["serviciomedico/login"]);
        }
        if (this.idConsulta!=undefined && this.idConsulta!="-1"){ 
            this.arrayReferencias=[];     
            this.buscarConsulta();            
        }
    }

    async buscarConsulta(){
        this.filtro.uidConsulta=this.idConsulta;
        await this.srvConsultas.consultaFilter(this.filtro)
        .toPromise()
        .then(async result => {
        if (result[0]!= undefined){
            this.consulta=result[0];
            this.consulta.fecha= formatDate(this.consulta.fecha, 'dd-MM-yyyy', 'en');            
            this.convReferenciaInArray(this.consulta.referencia_medica);            
        }
        else
            this.consulta={}
        })        
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
                    doc.save(`referencia-${this.consulta.nombre_completo}.pdf`);
                },
                x: 5,
                y: 5,
                width: 190, 
                windowWidth: 850,
            });
        });
    }

}