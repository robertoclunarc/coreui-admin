export interface IGerencia {
    uid?: number;
    nombre?: string;
    activa?: boolean
}

export interface Idepartamentos {
    uid?: number;
    descripcion?: string;
    id_gerencia?: number;
    ccosto?: number;
    area?: number;
}

export interface IAreas {
    uid?: number;
    descripcion?: string;    
}

export interface IvDepartamentos {
    departamento?: Idepartamentos;
    area?: IAreas;
    gerencia?: IGerencia;   
    
}