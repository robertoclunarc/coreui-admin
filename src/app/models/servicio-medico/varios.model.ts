export interface Ipopover {
    titulo?: string;
    alerta?: string;
}

export interface INivelAcademico{
    uid?: number;
    descrip?: string;
    peso_nivel?: number
}

export interface IContratista{
    uid?: number;
    nombre?: string;
} 

export interface brandBoxChartData {    
    data?: number[];
    label?: string;
}

export interface IUnidad{
    idunidad?: number;
    descripcion?: string;
    estatus?: string;
}
