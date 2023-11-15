import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { ConsultasService  } from '../../../services/servicio_medico/consultas.service';
import { VarioService  } from '../../../services/servicio_medico/varios.service';
import { MedicosService } from '../../../services/servicio_medico/medicos.service';
import { IMedicos, ItotalAtenciones } from '../../../models/servicio-medico/medicos.model';
import { brandBoxChartData } from '../../../models/servicio-medico/varios.model'
import { formatDate } from '@angular/common';

@Component({
  //selector: 'app-principal-servicio-medico',
  templateUrl: './principal-servicio-medico.component.html',
  providers: [ConsultasService, VarioService, MedicosService ],
})
export class PrincipalServicioMedicoComponent implements OnInit {
  
  arrayMotivos: {id_motivo: number, descripcion: string, totalmotivos: number }[]=[];
  arrayAfecciones: {fecha: string, dia: string, fkafeccion?: number, descripcion_afeccion?: string, cantafeccion: number} []=[];
  mainChartFecha: string[]=[];
  inicioMainGraf: string;
  finMainGraf: string;
  arrayMedicos: ItotalAtenciones[]=[];
  countMotivos1: number=0;
  cantMotivos1: number=0;
  countMotivos2: number=0;
  cantMotivos2: number=0;
  countMotivos3: number=0;
  cantMotivos3: number=0;
  countMotivos4: number=0;
  cantMotivos4: number=0;
  loginHtml1: string="brismd";
  loginHtml2: string="brismd";
  loginHtml3: string="brismd";
  loginHtml4: string="brismd";
  loginDrTitular: IMedicos;
  brandBoxChartDataX: { login?: string, countMotivos?: number, cantMotivos?:number, box?:brandBoxChartData[] }[]=[];
  constructor(
    private srvConsultas: ConsultasService,
    private srvVarios: VarioService,
    private srvMedicos: MedicosService,
    ) {   }
  
  async ngOnInit() {
    // generate random values for mainChart
    /*for (let i = 0; i <= this.mainChartElements; i++) {
      this.mainChartData1.push(this.random(50, 200));
      this.mainChartData2.push(this.random(80, 100));
      this.mainChartData3.push(65);
    }*/
    this.loginDrTitular = await this.srvMedicos.medicoTitular();
    this.loginHtml1= this.loginDrTitular.login;    
    
    await this.llenarArrayMedicos('PARAMEDICO');
    await this.llenarArrayMotivos();
    this.llenarArrayMotivosDelanio();
    await this.llenarArrayAfecionesDay();
    await this.llenarBrandBoxChartData1();
  }

  private async generarSerie(inicio: string, fin: string, interval: string, formato: string, formatFecha: string) {
    this.mainChartLabels=[];
    this.mainChartFecha=[];
		return await this.srvVarios.generarSerie(inicio, fin, interval, formato)
			.toPromise()
      .then(async result => 
        {
          for await (let s of result ){
            if (formatFecha==="y"){
              this.mainChartLabels.push(formatDate(s.fecha, formatFecha, 'en'));
            }
            else{
              const formatoDate: string = s.dia + ' ' + formatDate(s.fecha, formatFecha, 'en');
              
              this.mainChartLabels.push(formatoDate);
            }
            this.mainChartFecha.push(s.fecha);
          }
        }
      )			
			.catch(err => { console.log(err) });
	}

  private async afeccionesAll(interval: string) {
    
		return await this.srvConsultas.consultasAfeccionesAll(interval).toPromise()      	
			.catch(err => { console.log(err) });
	}

  private async llenarArrayMotivos() {
    
		return await this.srvConsultas.consultasPorMotivos()
			.toPromise()
      .then(result => 
        {
          this.arrayMotivos= result;
          if (result.length<4){
            for(let i = result.length; i<4; i++){
              this.arrayMotivos.push({descripcion: null, id_motivo: null, totalmotivos: 0})
            }
          }
        }
      )			
			.catch(err => { console.log(err) });
	}

  async llenarArrayMedicos(tipoMedico: string) {
    
		return await this.srvMedicos.contadorAtenciones()
			.toPromise()
      .then(result => 
        {
          //this.arrayMedicos= result;
          this.arrayMedicos=result.filter(a => a.tipo_medico==tipoMedico).sort(function (a, b){return b.totalconsulta - a.totalconsulta});
        }
      )			
			.catch(err => { console.log(err) });
	}

  async llenarArrayAfecionesDay() {    
    this.mainChartData1=[];
    this.mainChartData2=[];
    this.mainChartData3=[];
    let afecciones: number[]=[];
    let afeccionesAll: any;
    this.ConfigMainChartOptions(20, 20);
		return await this.srvConsultas.consultasAfecciones()
			.toPromise()
      .then(async result => 
        {
          this.arrayAfecciones= result;
          
          this.inicioMainGraf=formatDate(result[0].fecha, 'yyyy-MM-dd', 'en');
          this.finMainGraf=formatDate(result[result.length - 1].fecha, 'yyyy-MM-dd', 'en');
          
          await this.generarSerie(this.inicioMainGraf, this.finMainGraf, '1 day', 'DY', 'dd-MM-YYYY');
          afeccionesAll = await this.afeccionesAll('30 day');
          for (let i = 0; i < afeccionesAll.length; i++){
            afecciones.push(afeccionesAll[i].fkafeccion);            
          }
          /*afecciones= result.map(item => item.fkafeccion)
          .filter((value, index, self) => self.indexOf(value) === index)*/// esto hace lo mismo que un select disctinct pero con un array
          
          for (let j=0; j<= this.mainChartElements ; j++){
            this.mainChartData1.push(0);
            this.mainChartData2.push(0);
            this.mainChartData3.push(0);
            for (let i = 0; i <= this.arrayAfecciones.length- 1 ; i++) {
              if (this.arrayAfecciones[i].fecha===this.mainChartFecha[j]){
                if (this.arrayAfecciones[i].cantafeccion===0){                  
                  break;
                }
                else{
                
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[0]){
                      this.mainChartData1[j]= Number( this.arrayAfecciones[i].cantafeccion); 
                    }
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[1]){  
                      this.mainChartData2[j]=Number(this.arrayAfecciones[i].cantafeccion);
                    }
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[2]){  
                      this.mainChartData3[j]=Number(this.arrayAfecciones[i].cantafeccion);
                    }
                }      
              }
            }
          }
          
          //console.log(this.mainChartData2);
          //console.log(this.mainChartData);
          this.mainChartData[0]={
              data: this.mainChartData1,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[0]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[0].backgroundColor,
              borderColor: this.mainChartColours[0].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[0].pointHoverBackgroundColor,
              // _meta:
            };
          this.mainChartData[1]={
              data: this.mainChartData2,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[1]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[1].backgroundColor,
              borderColor: this.mainChartColours[1].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[1].pointHoverBackgroundColor,
            };
          this.mainChartData[2]={
              data: this.mainChartData3,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[2]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[2].backgroundColor,
              borderColor: this.mainChartColours[2].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[2].pointHoverBackgroundColor,
            }         
        }
      )			
			.catch(err => { console.log(err) });
	}
  

  async llenarArrayAfecionesMes() {
    this.mainChartLabels=[];
    this.mainChartData1=[];
    this.mainChartData2=[];
    this.mainChartData3=[];
    let afecciones: number[]=[];
    let afeccionesAll: any;
    const mesesIntervalo: number = 30;
    this.ConfigMainChartOptions(20, 180);
		return await this.srvConsultas.consultasAfeccionesMeses()
			.toPromise()
      .then(async result => 
        {
          this.arrayAfecciones= result;          
          
          //this.inicioMainGraf=formatDate(result[0].fecha, 'yyyy-MM-dd', 'en');
          //this.finMainGraf=formatDate(result[result.length - 1].fecha, 'yyyy-MM-dd', 'en');

          let fecha1 = new Date();
          let fecha2 = fecha1.getTime() - (1000*60*60*24*mesesIntervalo*12*2.5);

          this.inicioMainGraf=formatDate(fecha2, 'yyyy-MM-dd', 'en');
          this.finMainGraf=formatDate(fecha1, 'yyyy-MM-dd', 'en');
          
          //console.log(Math.round(resta/ (1000*60*60*24*30*12)))

          await this.generarSerie(this.inicioMainGraf, this.finMainGraf, '30 day', 'MON', 'YYYY');
          afeccionesAll = await this.afeccionesAll(`${mesesIntervalo} month`);
          afecciones.push(afeccionesAll[0].fkafeccion);
          afecciones.push(afeccionesAll[1].fkafeccion);
          afecciones.push(afeccionesAll[2].fkafeccion);
          
          /*afecciones= result.map(item => item.fkafeccion)
          .filter((value, index, self) => self.indexOf(value) === index)*/// esto hace lo mismo que un select disctinct pero con un array
          
          for (let j=0; j<= this.mainChartElements ; j++){
            this.mainChartData1.push(0);
            this.mainChartData2.push(0);
            this.mainChartData3.push(0);
            for (let i = 0; i <= this.arrayAfecciones.length- 1 ; i++) {
              if (this.arrayAfecciones[i].fecha===this.mainChartFecha[j]){
                if (this.arrayAfecciones[i].cantafeccion===0){                  
                  break;
                }
                else{
                
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[0]){
                      this.mainChartData1[j]= Number( this.arrayAfecciones[i].cantafeccion); 
                    }
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[1]){  
                      this.mainChartData2[j]=Number(this.arrayAfecciones[i].cantafeccion);
                    }
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[2]){  
                      this.mainChartData3[j]=Number(this.arrayAfecciones[i].cantafeccion);
                    }
                }      
              }
            }
          }
          
          //console.log(this.mainChartData2);
          //console.log(this.mainChartData);
          this.mainChartData[0]={
              data: this.mainChartData1,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[0]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[0].backgroundColor,
              borderColor: this.mainChartColours[0].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[0].pointHoverBackgroundColor,
              // _meta:
            };
          this.mainChartData[1]={
              data: this.mainChartData2,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[1]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[1].backgroundColor,
              borderColor: this.mainChartColours[1].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[1].pointHoverBackgroundColor,
            };
          this.mainChartData[2]={
              data: this.mainChartData3,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[2]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[2].backgroundColor,
              borderColor: this.mainChartColours[2].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[2].pointHoverBackgroundColor,
            }         
         
        }
      )			
			.catch(err => { console.log(err) });
	}

  async llenarArrayAfecionesAnio() {
    this.mainChartLabels=[];
    this.mainChartData1=[];
    this.mainChartData2=[];
    this.mainChartData3=[];
    let afecciones: number[]=[];
    let afeccionesAll: any;
    const mesesIntervalo: number = 30;
    this.ConfigMainChartOptions(5, 400);
		return await this.srvConsultas.consultasAfeccionesAnios()
			.toPromise()
      .then(async result => 
        {
          this.arrayAfecciones= result;          
          
          //this.inicioMainGraf=formatDate(result[0].fecha, 'yyyy-MM-dd', 'en');
          //this.finMainGraf=formatDate(result[result.length - 1].fecha, 'yyyy-MM-dd', 'en');

          let fecha1 = new Date();
          let fecha2 = fecha1.getTime() - (1000*60*60*24*mesesIntervalo*12*4);

          this.inicioMainGraf=formatDate(fecha2, 'yyyy-MM-dd', 'en');
          this.finMainGraf=formatDate(fecha1, 'yyyy-MM-dd', 'en');
          
          //console.log(Math.round(resta/ (1000*60*60*24*30*12)))

          await this.generarSerie(this.inicioMainGraf, this.finMainGraf, '12 month', 'YYYY', 'y');
          afeccionesAll = await this.afeccionesAll(`${mesesIntervalo} year`);
          afecciones.push(afeccionesAll[0].fkafeccion);
          afecciones.push(afeccionesAll[1].fkafeccion);
          afecciones.push(afeccionesAll[2].fkafeccion);
          
          /*afecciones= result.map(item => item.fkafeccion)
          .filter((value, index, self) => self.indexOf(value) === index)*/// esto hace lo mismo que un select disctinct pero con un array
          
          for (let j=0; j<= this.mainChartElements ; j++){
            this.mainChartData1.push(0);
            this.mainChartData2.push(0);
            this.mainChartData3.push(0);
            for (let i = 0; i <= this.arrayAfecciones.length- 1 ; i++) {
              if (this.arrayAfecciones[i].fecha===this.mainChartFecha[j]){
                if (this.arrayAfecciones[i].cantafeccion===0){                  
                  break;
                }
                else{
                
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[0]){
                      this.mainChartData1[j]= Number( this.arrayAfecciones[i].cantafeccion); 
                    }
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[1]){  
                      this.mainChartData2[j]=Number(this.arrayAfecciones[i].cantafeccion);
                    }
                    if (this.arrayAfecciones[i].fkafeccion===afecciones[2]){  
                      this.mainChartData3[j]=Number(this.arrayAfecciones[i].cantafeccion);
                    }
                }      
              }
            }
          }
          
          //console.log(this.mainChartData2);
          //console.log(this.mainChartData);
          this.mainChartData[0]={
              data: this.mainChartData1,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[0]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[0].backgroundColor,
              borderColor: this.mainChartColours[0].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[0].pointHoverBackgroundColor,
              // _meta:
            };
          this.mainChartData[1]={
              data: this.mainChartData2,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[1]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[1].backgroundColor,
              borderColor: this.mainChartColours[1].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[1].pointHoverBackgroundColor,
            };
          this.mainChartData[2]={
              data: this.mainChartData3,
              label: this.arrayAfecciones.find(a=>a.fkafeccion==afecciones[2]).descripcion_afeccion ,
              backgroundColor: this.mainChartColours[2].backgroundColor,
              borderColor: this.mainChartColours[2].borderColor,
              pointHoverBackgroundColor: this.mainChartColours[2].pointHoverBackgroundColor,
            }         
         
        }
      )			
			.catch(err => { console.log(err) });
	}

  ConfigMainChartOptions(maxTicksLimit: number, max: number){
  this.mainChartOptions={
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: maxTicksLimit,
          stepSize: Math.ceil(max / 5),
          max: max
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  }

  async llenarArrayMotivosDelanio() {
    let chart0data: number[]=[];
    let chart1data: number[]=[];
    let chart2data: number[]=[];
    let bar1data: number[]=[];
    
    this.lineChart1Data=[];
    this.lineChart2Data=[]
    this.lineChart3Data=[];
    this.barChart1Data=[];
    
    this.totallineChart1Data= this.arrayMotivos[0].totalmotivos == undefined ? 0 : this.arrayMotivos[0].totalmotivos;
    this.totallineChart2Data= this.arrayMotivos[1].totalmotivos == undefined ? 0 : this.arrayMotivos[1].totalmotivos;    
    this.totallineChart3Data= this.arrayMotivos[2].totalmotivos == undefined ? 0 : this.arrayMotivos[2].totalmotivos;
    this.totalbarChart1Data= this.arrayMotivos[3].totalmotivos == undefined ? 0 : this.arrayMotivos[3].totalmotivos;
    
    this.desclineChart1Data= this.arrayMotivos[0].descripcion;
    this.desclineChart2Data= this.arrayMotivos[1].descripcion;
    this.desclineChart3Data= this.arrayMotivos[2].descripcion;
    this.descbarChart1Data= this.arrayMotivos[3].descripcion;
    
		return await this.srvConsultas.consultasPorMotivosDelAnio()
			.toPromise()
      .then(async result => { //console.log(result);
        for await (let mot of result){
          if (mot.id_motivo==this.arrayMotivos[0].id_motivo){
            chart0data.push(mot.cantmotivos);
                      
          }
          if (mot.id_motivo==this.arrayMotivos[1].id_motivo){
            chart1data.push(mot.cantmotivos);
                       
          }
          if (mot.id_motivo==this.arrayMotivos[2].id_motivo){
            chart2data.push(mot.cantmotivos);
                    
          }
          if (mot.id_motivo==this.arrayMotivos[3].id_motivo){
            bar1data.push(mot.cantmotivos); 
            
          }
        }
       
         this.barChart1Data.push({ 
            backgroundColor: this.barChart1Colours[0].backgroundColor,
            borderWidth: this.barChart1Colours[0].borderWidth,   
            data: bar1data,
            label: this.descbarChart1Data,
            barPercentage: 0.5,
        });

        this.lineChart1Data.push({
          backgroundColor: this.lineChart1Colours[0].backgroundColor, 
          borderColor: this.lineChart1Colours[0].borderColor,
          data: chart0data, 
          label: this.desclineChart1Data
        });        
        
        this.lineChart2Data.push({
          backgroundColor: this.lineChart2Colours[0].backgroundColor, 
          borderColor: this.lineChart2Colours[0].borderColor,
          data: chart1data, 
          label: this.desclineChart2Data
        });

        this.lineChart3Data.push({
          backgroundColor: this.lineChart3Colours[0].backgroundColor, 
          borderColor: this.lineChart3Colours[0].borderColor, 
          data: chart2data, 
          label: this.desclineChart3Data
        });
        
        
        /*console.log(this.barChart1Data);
        console.log(this.lineChart1Data);
        console.log(this.lineChart2Data);
        console.log(this.lineChart3Data);*/
      })			
			.catch(err => { console.log(err) });
	}

  async llenarBrandBoxChartData1(){
    let arrayMotivosMedicoslabel: string[]=[];
    let arrayMotivosMedicosData: number[]=[];
    let cantMotivos: number=0;
    this.brandBoxChartData1 = [];
    let loginDr: string= this.loginDrTitular.login;
    await this.srvConsultas.countAtencionPorMotivosMedicos(loginDr, 'MEDICO')
			.toPromise()
      .then(async result => 
        {
          for await (let mot of result){
            arrayMotivosMedicosData.push(mot.totalmotivos);
            arrayMotivosMedicoslabel.push(mot.descripcion);
            cantMotivos  += Number(mot.totalmotivos)
          }
        }
      )			
			.catch(err => { console.log(err) });

    this.loginHtml1=loginDr;
    this.countMotivos1 = arrayMotivosMedicosData.length;
    this.cantMotivos1 = cantMotivos;
    this.brandBoxChartLabels=arrayMotivosMedicoslabel;        
    this.brandBoxChartData1 = [
      {
        data: arrayMotivosMedicosData,
        label: 'ultimos 12 meses ' + loginDr
      }
    ];    
    
    //this.arrayMedicos.splice(3, this.arrayMedicos.length);     
    
    for await (let m of this.arrayMedicos){
        if (m.login!=loginDr){
          cantMotivos=0;
          arrayMotivosMedicosData=[];
          await this.srvConsultas.countAtencionPorMotivosMedicos(m.login, 'PARAMEDICO')
          .toPromise()
          .then(async result => 
            {
              for await (let mot of result){
                
                arrayMotivosMedicosData.push(mot.totalmotivos);                
                cantMotivos  += Number(mot.totalmotivos);
              }
            }
          )			
          .catch(err => { console.log(err) });
          
          /////////////////////////////////////////////
          
            this.loginHtml2 = m.login;
            this.countMotivos2 = arrayMotivosMedicosData.length;
            this.cantMotivos2 = cantMotivos;

            this.brandBoxChartDataX.push({
              login: m.login,
              countMotivos: arrayMotivosMedicosData.length,
              cantMotivos: cantMotivos,
              box: [
                {
                  data: arrayMotivosMedicosData,
                  label: 'ultimos 12 meses ' + m.login
                }
              ]
            })            
        }
        
    }
    
  }

  radioModel: string = 'Mes';
  totalbarChart1Data: number=0;
  totallineChart1Data: number=0;
  totallineChart2Data: number=0;
  totallineChart3Data: number=0;

  descbarChart1Data: string;
  desclineChart1Data: string;
  desclineChart2Data:string;
  desclineChart3Data: string;
  
  // lineChart1
  public lineChart1Data: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Series A'
    }
  ];
  public lineChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug','Sept','Oct','Nov','Dec'];
  public lineChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 5,//40 - 5,
          max: 89//84 + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart1Colours: Array<any> = [
    {
      backgroundColor: getStyle('--primary'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart1Legend = false;
  public lineChart1Type = 'line';

  // lineChart2 
  public lineChart2Data: Array<any> = [
    {
      data: [1, 18, 9, 17, 34, 22, 11],
      label: 'Series A'
    }
  ];
  public lineChart2Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug','Sept','Oct','Nov','Dec'];
  public lineChart2Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: 1 - 5,
          max: 300 + 5,
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart2Colours: Array<any> = [
    { // grey
      backgroundColor  : getStyle('--info'),
      borderColor: 'rgba(255,255,255,.55)'
    }
  ];
  public lineChart2Legend = false;
  public lineChart2Type = 'line';


  // lineChart3
  public lineChart3Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'Series A'
    }
  ];
  public lineChart3Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug','Sept','Oct','Nov','Dec'];
  public lineChart3Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
    legend: {
      display: false
    }
  };
  public lineChart3Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
    }
  ];
  public lineChart3Legend = false;
  public lineChart3Type = 'line';


  // barChart1
  public barChart1Data: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40, 78, 81, 80, 45, 34, 12, 40, 12, 40],
      label: 'Series A',
      barPercentage: 0.5,
    }
  ];
  public barChart1Labels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Aug','Sept','Oct','Nov','Dec'];
  public barChart1Options: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false
      }]
    },
    legend: {
      display: false
    }
  };
  public barChart1Colours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.3)',
      borderWidth: 0
    }
  ];
  public barChart1Legend = false;
  public barChart1Type = 'bar';

  // mainChart

  public mainChartElements = 30;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Current'
    },
    {
      data: this.mainChartData2,
      label: 'Previous'
    },
    {
      data: this.mainChartData3,
      label: 'BEP'
    }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 20,
          stepSize: Math.ceil(20 / 5),
          max: 20
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  // social box charts

  public brandBoxChartData1: Array<any> = [
    {
      data: [65, 59, 84, 84, 51, 55, 40],
      label: 'Cantidad Atenciones: '
    }
  ];
  public brandBoxChartData2: Array<any> = [
    {
      data: [1, 13, 9, 17, 34, 41, 38],
      label: 'Twitter'
    }
  ];
  public brandBoxChartData3: Array<any> = [
    {
      data: [78, 81, 80, 45, 34, 12, 40],
      label: 'LinkedIn'
    }
  ];
  public brandBoxChartData4: Array<any> = [
    {
      data: [35, 23, 56, 22, 97, 23, 64],
      label: 'Google+'
    }
  ];

  public brandBoxChartLabels: Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public brandBoxChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
      }],
      yAxes: [{
        display: false,
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public brandBoxChartColours: Array<any> = [
    {
      backgroundColor: 'rgba(255,255,255,.1)',
      borderColor: 'rgba(255,255,255,.55)',
      pointHoverBackgroundColor: '#fff'
    }
  ];
  public brandBoxChartLegend = false;
  public brandBoxChartType = 'line';

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  
}