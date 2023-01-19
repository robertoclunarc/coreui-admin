import { IPaciente } from './paciente.model';
import { Idepartamentos } from './departamentos.model';

export interface IHistoria_medica{
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

export interface IHistoria_paciente{
    fk_historia?: number;
    fecha_historia?: string;
    indice?: number;
    motivo_historia?: string;
    observacion?: string;
    fk_medico?: number;
    fk_consulta?: number;
}

export interface IHistoriaGral {
    historia?: IHistoria_medica,
    paciente?: IPaciente,
    depto?: Idepartamentos,
    examenfisico?: string,
    habitos?: string,
    riesgos?: string,
    psicologicos?: string,
 }