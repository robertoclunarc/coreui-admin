export interface IMedicamento{
    uid?: number; 
    descripcion?: string; 
    unidad_medida?: string; 
    existencia?: number;
    activo?: boolean
    tipo?: string;
}

export interface IMedicamentosAplicados{
    uid?: number; 
    id_consulta?: number; 
    id_medicamento?: number; 
    cantidad?: number; 
    medidas?: string;
}

export interface IMedicinasAplicadas{     
    medicamento?: IMedicamento; 
    cantidad?: number; 
    medidas?: string;
}

export interface ImedicamentosConsulta{
    uid?: number; 
    id_consulta?: number; 
    medicamentos?: IMedicinasAplicadas[]; 
}