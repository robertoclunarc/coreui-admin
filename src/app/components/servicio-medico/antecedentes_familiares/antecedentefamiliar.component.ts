import { Component, ViewChild, OnChanges, Inject, LOCALE_ID, NgModule, ElementRef, Input, Output, EventEmitter} from '@angular/core';
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
export class AntecedenteFamiliarComponent implements OnChanges {

  @Output() itemsAntecedentes= new EventEmitter<number>();
  @Input() _uidPaciente: string;
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

  antecedentesFamiliares: IAntecedentesFamiliares[]=[]; 
  public antecedenteFamiliar: IAntecedenteFamiliar={};
  public ArrayPatologias: IPatologia[]; 
  private user: IUsuarios={};
  private tipoUser: string; 
  private alertaRegistrar: string; 
  private titleRegistrar: string;
  private popover: Ipopover={} ;
  public soloLectura: boolean;
  public arrayFamiliares=[
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
  public arrayEstatus=[
    {label: 'Vivo', value:'Vivo'},
    {label: 'Fallecido', value:'Fallecido'},
  ];
  
  
  alertsDismiss: any = [];

  ngOnChanges(): void {
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

    if (this._uidPaciente!=undefined && !isNaN(Number(this._uidPaciente)))
      this.antecedenteFamiliar.fk_paciente = Number(this._uidPaciente);
    if (this.route.snapshot.paramMap.get("idPaciente")!=undefined)
      this.antecedenteFamiliar.fk_paciente = Number(this.route.snapshot.paramMap.get("idPaciente"));
    if (isNaN(Number(this._uidPaciente)))
      this.antecedenteFamiliar.fk_paciente = -1;
    
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
        else{
          this.antecedentesFamiliares=[];          
        }
        this.itemsAntecedentes.emit(result.length);
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

  async guardar(){    
    
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
