export interface IMedicos {
    uid?: number;
    nombre?: string;
    activo?: boolean;
    ci?: string;
    id_ss?: string;
    nro_colegiado?: string;
    nombre_ssst?: string;
    tipo_ssst?: string;
    login?: string;
}    

export interface IParamedicos {
    uid?: number;
    nombre?: string;
    activo?: boolean;
    ci?: string;    
    login?: string;
}

export interface ItotalAtenciones{
    idUser?: number;
    nombre?: string;
    login?: string;
    tipo_medico?: string;
    totalconsulta?: number;
    ultima_atencion?: string;
}