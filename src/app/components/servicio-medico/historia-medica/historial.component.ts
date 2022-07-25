//componentes
import { Component, ViewChild, OnInit, SecurityContext,Inject,  LOCALE_ID, ElementRef } from '@angular/core';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { formatDate } from '@angular/common';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router } from '@angular/router';

//servicios

import { PacientesService } from '../../../services/servicio_medico/pacientes.service';

//modelos
import { Ipopover } from '../../../models/servicio-medico/varios.model';
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';

@Component({
  selector: 'app-historial',
  templateUrl: 'historial.component.html',
  providers: [ PacientesService,   { provide: AlertConfig }],
  styleUrls: ["historial.component.css"]             
})
export class HistoriaMedicaComponent  implements OnInit  {  

  @ViewChild('primaryModal') public primaryModal: ModalDirective;
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  isCollapsed: boolean = false;
  iconCollapse: string = 'icon-arrow-up';

  isCollapsed_1: boolean = true;
  iconCollapse_1: string = 'icon-arrow-down';

  private user: IUsuarios={};
  private tipoUser: string;    
  
  private alertsDismiss: any = []; 
   
  

  constructor(
    private router: Router,
    //private sanitizer: DomSanitizer,       
    @Inject(LOCALE_ID) public locale: string,  
    ) {  }

  ngOnInit(): void {
    
    
	}
  

 

 
}
