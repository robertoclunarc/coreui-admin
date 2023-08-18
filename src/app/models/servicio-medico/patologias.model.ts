export interface IPatologia{
    uid?: number;
    descripcion?: string;
    tipo?: string;
    codigo_etica?: string;
    url?: string;
    padre?: number;
    hijo?: number;
    estatus?: boolean;
    view?: number;    
}