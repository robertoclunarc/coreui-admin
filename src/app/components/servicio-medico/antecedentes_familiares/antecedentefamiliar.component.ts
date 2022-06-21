import { Component, ViewChild, OnInit, Inject, LOCALE_ID, NgModule, ElementRef} from '@angular/core';
import { AlertConfig, AlertComponent } from 'ngx-bootstrap/alert';
import { Router, ActivatedRoute } from '@angular/router';

//modelos
import { IAntecedenteFamiliar, IAntecedentesFamiliares } from '../../../models/servicio-medico/antecedentesfamiliares.model';
import { IPatologia } from '../../../models/servicio-medico/patologias.model'
import { IUsuarios } from '../../../models/servicio-medico/usuarios.model';
import { Ipopover } from '../../../models/servicio-medico/varios.model';

//servicios
import { AntecedentesFamiliaresService } from '../../../services/servicio_medico/antecedentesfamiliares.service';
import { PatologiasService } from '../../../services/servicio_medico/patologias.service'

@Component({
  selector: 'app-antecedentefamiliar',
  templateUrl: './antecedentefamiliar.component.html',
  styleUrls: ['./antecedentefamiliar.component.css'],
  providers: [ AntecedenteFamiliarComponent , PatologiasService,
    { provide: AlertConfig }],
})
export class AntecedenteFamiliarComponent implements OnInit {

  @ViewChild('cboPatologia') cboPatologia!: ElementRef<HTMLInputElement>;
  @ViewChild('cboParentezco') cboParentezco!: ElementRef<HTMLInputElement>;
  @ViewChild('cboEstatusFamiliar') cboEstatusFamiliar!: ElementRef<HTMLInputElement>;  

  constructor( 
    private route: ActivatedRoute,  
    private router: Router,
    private srvAntecedentesFamiliares: AntecedentesFamiliaresService,
    private srvPatologias: PatologiasService,
    @Inject(LOCALE_ID) public locale: string,
    
  ) { }

  private antecedentesFamiliares: IAntecedentesFamiliares[]=[]; 
  private antecedenteFamiliar: IAntecedenteFamiliar={};
  private ArrayPatologias: IPatologia[]; 
  private user: IUsuarios={};
  private tipoUser: string; 
  private alertaRegistrar: string; 
  private titleRegistrar: string;
  private popover: Ipopover={} ;
  private soloLectura: boolean;
  private arrayFamiliares=[
    {label: 'Padre', value:'Padre'},
    {label: 'Madre', value:'Madre'},
    {label: 'Abuelo Paterno', value:'Abuelo Paterno'},
    {label: 'Abuela Paterna', value:'Abuela Paterna'},
    {label: 'Abuelo Materno', value:'Abuelo Materno'},
    {label: 'Abuela Materna', value:'Abuela Materna'},
    {label: 'Hermano', value:'Hermano'},
    {label: 'Hermana', value:'Hermana'},
    {label: 'Tio', value:'Tio'},
    {label: 'Tia', value:'Tia'},
    {label: 'Otro Familiar', value:''}
  ];
  private arrayEstatus=[
    {label: 'Vivo', value:'Vivo'},
    {label: 'Fallecido', value:'Fallecido'},
  ];
  
  
  private alertsDismiss: any = [];

  ngOnInit(): void {
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
   
    this.antecedenteFamiliar.fk_paciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    this.llenarArrayPatologias();
    this.buscarAntecedentesFamiliares();    
  }

  private async buscarAntecedentesFamiliares(){
    
    if (this.antecedenteFamiliar.fk_paciente!= undefined && this.antecedenteFamiliar.fk_paciente!= null){
      await this.srvAntecedentesFamiliares.AntecedentesFamiliaresOnePaciente(this.antecedenteFamiliar.fk_paciente.toString())
      .toPromise()
      .then(result => {
        if (result.length>0){
          this.antecedentesFamiliares=result; 
        }
        else
          this.antecedentesFamiliares=[];
        
      })
    }    
  }

  private async llenarArrayPatologias(){   
    
      await this.srvPatologias.patologiasAntecedentesFamiliares()
      .toPromise()
      .then(result => {
        if (result){
          this.ArrayPatologias=result; 
        }
        else
        this.ArrayPatologias=[]
        
      })
       
  }

  private async nuevoAntecedente(){    
    await this.srvAntecedentesFamiliares.registrarAntecedenteFamiliar(this.antecedenteFamiliar)
    .toPromise()
    .then( result  => {
      if (result){
        
        this.antecedentesFamiliares.push({
          fk_paciente: result.fk_paciente,
          patologia: { uid: result.fk_patologia, descripcion: this.ArrayPatologias.find(p=>p.uid===result.fk_patologia).descripcion },
          estatus_familiar: result.estatus_familiar,
          paterentezco: result.paterentezco
        });
        
      }      
      this.antecedenteFamiliar.estatus_familiar="";
      this.antecedenteFamiliar.fk_patologia=null;
      this.antecedenteFamiliar.paterentezco="";
    })
  }  

  private async guardar(){    
    
    this.popover = await this.validaEntradas();
    
    if ( this.popover.alerta!=undefined){ 
      
      this.alertaRegistrar = this.popover.alerta;
      this.titleRegistrar = this.popover.titulo;
      this.popover={};      
      this.showSuccess(this.titleRegistrar+': '+this.alertaRegistrar, 'danger');     
      
      return;
    }

    await this.nuevoAntecedente();    
    
    if (this.antecedenteFamiliar){      
      this.showSuccess('Datos cargados satisfactoriamente', 'success');
    }else{     
      
        this.showSuccess('Error en el registro del antecedente familiar', 'danger'); 
    }
    
  }
  
  reset(){
    this.antecedenteFamiliar.estatus_familiar="";
    this.antecedenteFamiliar.fk_patologia=null;
    this.antecedenteFamiliar.paterentezco="";
    this.antecedentesFamiliares=[];    
  } 

  private async  validaEntradas(){
    let popOver: Ipopover={};

    if (this.antecedenteFamiliar.fk_paciente == undefined){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el paciente"
      };
         
      return  popOver;
    }

    if (this.antecedenteFamiliar.fk_patologia == undefined || this.antecedenteFamiliar.fk_patologia==null){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar la patologia"
      };
      this.cboPatologia.nativeElement.focus();      
      return  popOver;
    }

    if (this.antecedenteFamiliar.paterentezco == undefined || this.antecedenteFamiliar.paterentezco ==""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el parentezco del familiar"
      };
      this.cboParentezco.nativeElement.focus();       
      return  popOver;
    }

    if (this.antecedenteFamiliar.estatus_familiar == undefined || this.antecedenteFamiliar.estatus_familiar == ""){
      popOver= {
        titulo:"Error en el Registro",
        alerta: "Debe especificar el estatus del familiar"
      };
      this.cboEstatusFamiliar.nativeElement.focus();      
      return  popOver;
    }    

    return  popOver;
  }

  onClosed(dismissedAlert: AlertComponent): void {
    this.alertsDismiss = this.alertsDismiss.filter(alert => alert !== dismissedAlert);
  }

  showSuccess(mensaje: string, clase: string): void {
    this.alertsDismiss.push({
      type: clase,
      msg: mensaje,
      //msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
  }

}
