import { IRiesgos } from './riesgos.model';

export interface IRiesgosHistoria {
    cedula?: string;
    fk_riesgo?: number;
    tiempo_exposicion?: string;
    resp?: string;
}

export interface IRiesgosHistorias {
    cedula?: string;
    riesgo?: IRiesgos;
    tiempo_exposicion?: string;
    resp?: string;
}

export interface IHistoriaMedica{
    uid_historia?: number;
    fecha_apertura?: string;
    fk_medico?: number;
    ha_sufrido_accidentes?: string;
    partes_cuerpo_lesionados?: string;
    fecha_accidente?: string;
    dejo_secuelas?: string;
    ha_padecido_enfermeda?: string;
    cambia_trab_frecuente?: string;
    fue_certif_inpsasel?: string;
    uid_paciente?: number;
    fecha_ultima_actualizacion?: string;
}

export interface IHistoriaPaciente{
    fk_historia?: number;
    fecha_historia?: string;
    indice?: number;
    motivo_historia?: string;
    observacion?: string;
    fk_medico?: number;
    fk_consulta?: number;
}