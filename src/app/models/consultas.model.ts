import { IAfecciones } from './afecciones.model';
import { IAreas } from './areas.model';
import { IMedicos, IParamedicos } from './medicos.model';
import { IMotivo } from './motivos.model';
import { IPaciente, IvPaciente } from './paciente.model';
import { IPatologia } from './patologias.model';
import { IRemitido } from './remitidos.model';
import { ITiempoReposo } from './tiemporeposos.model';

export interface IConsultas{
    uid?: number;
    id_paciente?: number;
    fecha?: string;
    id_motivo?: number;
    sintomas?: string;
    id_medico?: number;
    observaciones?: string;
    indicaciones?: string;
    fecha_prox_cita?: string;
    observacion_medicamentos?: string;
    resultado_eva?: string;
    id_paramedico?: number;
    id_area?: number;
    id_patologia?: number;
    id_remitido?: number;
    id_reposo?: number;
    fecha_registro?: string;
    turno?: number;
    indicaciones_comp?: string;
    referencia_medica?: string;
    condicion?: string;
    fkafeccion?: number;
    autorizacion?: string;
}

export interface IConsultasConstraint{
    uid?: number;
    paciente?: IvPaciente
    fecha?: string;
    motivo?: IMotivo;
    sintomas?: string;
    medico?: IMedicos;
    observaciones?: string;
    indicaciones?: string;
    fecha_prox_cita?: string;
    observacion_medicamentos?: string;
    resultado_eva?: string;
    paramedico?: IParamedicos;
    area?: IAreas;
    patologia?: IPatologia;
    remitido?: IRemitido;
    reposo?: ITiempoReposo;
    fecha_registro?: string;
    turno?: number;
    indicaciones_comp?: string;
    referencia_medica?: string;
    condicion?: string;
    afeccion?: IAfecciones;
    autorizacion?: string;
}

export interface IvConsulta {
    uid?: number;
    fecha?: string;
    autorizacion?: string;
    turno?: number;
    sintomas?: string;
    observaciones?: string;
    indicaciones?: string;
    fecha_prox_cita?: string;
    observacion_medicamentos?: string;
    resultado_eva?: string;
    indicaciones_comp?: string;
    referencia_medica?: string;
    fkafeccion?: number;
    condicion?: string;
    id_area?: number;
    idmotivo?: number;
    motivo?: string;
    remitido?: string;
    medico?: string;
    id_ss?: string;
    ci_medico?: string;
    area?: string;
    patologia?: string;
    reposo?: string;
    descripcion?: string;
    paramedico?: string;
    ci_paramedico?: string;
    uid_paciente?: number;
    ci?: string;
    nombre?: string;
    apellido?: string;
    nombre_completo?: string;
    gcia?: string;
    es_contratista?: boolean;
    id_contratista?: number;
    departamento?: string;
    contratista?: string;
    fechanac?: string;
    sexo?: string;
    cargo?: string;
    alergia?: string;
    tipo_discapacidad?: string;
    desc_discapacidad?: string;
    estado_paciente?: string;
    login_atendio?: string;
}

export interface IFiltroConsulta{
    uidPaciente?: string,
    uidConsulta?: string,
    fechaIni?: string,
    fechaFin?: string,
    ciMedico?: string,
    ciParamedico?: string,
    uidMotivo?: string
}