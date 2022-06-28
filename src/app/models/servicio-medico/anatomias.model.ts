export interface IAnatomia{
    uid_anatom?: number;
    tipo?: string;
    descripcion?: string;
}

export interface IExamenesFuncionales{
    cedula?: string;
    observacion?: string;
    anatomia?: IAnatomia;
}

export interface IExamenFuncional{
    cedula?: string;
    observacion?: string;
    fk_anatomia?: number;
}