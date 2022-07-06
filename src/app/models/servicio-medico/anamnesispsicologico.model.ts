export interface IAnalisisPsicologico{
    cedula?: string;
    fk_estudio?: number;
    observacion?: string;
    fecha_estudio?: string;
}

export interface IEstudioPsicologico{
    uid_estudio?: number;
    descripcion?: string;
}

export interface IAnamnesisPsicologico{
    cedula?: string;
    estudio?: IEstudioPsicologico;
    observacion?: string;
    fecha_estudio?: string;
}