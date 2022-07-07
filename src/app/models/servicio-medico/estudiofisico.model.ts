export interface IEstudiosFisico {
    uid_est_fisico?: number;
    descripcion?: string;
    lineas?: number;
}

export interface IExamenFisico {
    cedula?: string;
    fk_fisico?: number;
    observacion?: string;
    fecha_examen?: string;
}

export interface IExamenesFisicosPacientes {
    cedula?: string;
    examen?: IEstudiosFisico;
    observacion?: string;
    fecha_examen?: string;
}