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
import { IvConsulta, IFiltroConsulta } from '../../../../models/servicio-medico/consultas.model';

import { IindicacionMedica } from '../../../../models/servicio-medico/recetamedica.models';

@Component({
  selector: 'planilla-recipe',
  templateUrl: './planilla-recipe.html',
  providers: [ConsultasService, ],
  styleUrls: ['../planilla_style.css']
})

export class planillaRecipeComponent implements OnChanges {
  idConsulta: string;
  @ViewChild('htmltable', {static: false}) htmltable: ElementRef;
  @Input() inIdConsulta: string = "-1";
  private filtro: IFiltroConsulta={};
  private user: IUsuarios={};
  private tipoUser: string;
  titleButtonImp: string = "Imprimir PDF";
  disableButtonImp: boolean = false;
  
  consulta: IvConsulta = {};
  medicamentoIndicados: IindicacionMedica[]=[];
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
            this.medicamentoIndicados=[];
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
            this.convIndicacionesInArray(this.consulta.indicaciones_comp);            
        }
        else
            this.consulta={}
        })        
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
                        
          }
        }    
    }

    public exportHtmlToPDF(){
        this.titleButtonImp = "Loading...";
        this.disableButtonImp = true;
        let data = document.getElementById('htmltable');
     
        html2canvas(data).then(canvas => {
            
            let doc = new jsPDF('l', 'mm', 'letter');

            doc.html(data, {
                callback: () => {
                    // Utiliza una función de flecha para mantener el contexto
                    this.disableButtonImp = false;
                    this.titleButtonImp = "Imprimir PDF";         
                    doc.save(`recipe-${this.consulta.nombre_completo}.pdf`);
                },
                x: 5,
                y: 5,
                width: 270, 
                windowWidth: 850,
            });
        });
    }

}