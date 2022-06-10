export interface ICargoAnterior{
    fk_paciente?: number 
    cargo?: string;
    actividad_laboral?: string; 
    desde?: string; 
    hasta?: string;
    riesgos?: string;
}

export interface ICargoAnteriorOtra{
    fk_paciente?: number 
    empresa?: string;    
    actividad_laboral?: string; 
    desde?: string; 
    hasta?: string;
    riesgos?: string;
}